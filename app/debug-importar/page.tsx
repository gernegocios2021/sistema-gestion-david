'use client';

import { useState } from 'react';

export default function DebugImportarPage() {
  const [resultado, setResultado] = useState<any>(null);
  const [cargando, setCargando] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCargando(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/debug/importar', {
        method: 'POST',
        body: formData
      });

      const json = await res.json();
      setResultado(json);
    } catch (error) {
      setResultado({ error: String(error) });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Importar Excel</h1>
      <input
        type="file"
        accept=".xls,.xlsx"
        onChange={handleFileUpload}
        disabled={cargando}
      />
      {cargando && <p>Analizando...</p>}
      {resultado && (
        <pre className="mt-4 bg-gray-100 p-4 rounded">
          {JSON.stringify(resultado, null, 2)}
        </pre>
      )}
    </div>
  );
}