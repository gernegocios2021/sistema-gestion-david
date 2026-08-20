'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import * as XLSX from 'xlsx';

export default function ImportarPage() {
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [archivo, setArchivo] = useState<string>('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCargando(true);
    setArchivo(file.name);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
      // Leer todo como datos sin header automático
      const allData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Buscar la fila de encabezado (contiene "DOMINIO" o "MARCA")
      let headerRowIndex = -1;
      for (let i = 0; i < Math.min(5, allData.length); i++) {
        const row = allData[i] as any[];
        if (row.some((cell: any) => String(cell).includes('DOMINIO') || String(cell).includes('MARCA'))) {
          headerRowIndex = i;
          break;
        }
      }

      if (headerRowIndex === -1) {
        throw new Error('No se encontró fila de encabezado con DOMINIO o MARCA');
      }

      // Obtener encabezados
      const headers = allData[headerRowIndex] as string[];
      console.log('Headers encontrados:', headers);

      // Procesar todas las filas después del header
      const datos: any[] = [];
      for (let i = headerRowIndex + 1; i < allData.length; i++) {
        const row = allData[i] as any[];
        
        // Crear objeto con headers
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });

        // Validar que tenga datos importantes
        const patente = String(obj['DOMINIO.-'] || '').trim();
        const precio = String(obj['VALOR DE VENTA.-'] || '').trim();

        // Saltear filas vacías o encabezados secundarios
        if (!patente || patente.length < 2 || !precio || precio === '-' || isNaN(parsePrice(precio))) {
          continue;
        }

        datos.push(obj);
      }

      console.log(`Total filas procesadas: ${datos.length}`);

      if (datos.length === 0) {
        throw new Error('No se encontraron vehículos válidos');
      }

      // Enviar al servidor
      const res = await fetch('/api/importar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ datos })
      });

      const json = await res.json();
      setResultado(json);
    } catch (error) {
      setResultado({ error: String(error), success: false });
    } finally {
      setCargando(false);
    }
  };

  // Función para parsear precio
  const parsePrice = (priceStr: string): number => {
    const cleaned = priceStr.replace(/[$USD\s.-]/g, '').replace(/,/g, '.');
    return parseFloat(cleaned) || 0;
  };

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="md:ml-64 flex-1 bg-gray-50 min-h-screen p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">📥 Importar Lista de Precios</h1>

          <div className="bg-white p-8 rounded-lg shadow mb-8">
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
              <p className="text-gray-900 font-semibold mb-2">Sube tu Excel de lista de precios</p>
              <p className="text-gray-600 text-sm mb-4">Soporta múltiples secciones (AUTOS, MOTOS, etc)</p>
                            <label className="cursor-pointer inline-block">
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={handleFileUpload}
                  disabled={cargando}
                  className="hidden"
                />
                <span className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block font-semibold">
                  📁 Seleccionar archivo Excel
                </span>
              </label>
              {cargando && <p className="text-blue-600 mt-4 font-semibold">⏳ Procesando...</p>}
            </div>
          </div>

          {resultado && (
            <div className={`p-6 rounded-lg border-l-4 ${resultado.success ? 'bg-green-50 border-green-600' : 'bg-red-50 border-red-600'}`}>
              {resultado.success ? (
                <div>
                  <p className="text-green-700 font-bold text-lg mb-3">✅ Importación Exitosa</p>
                  <p className="text-gray-900 mb-2">Archivo: <strong>{archivo}</strong></p>
                  <p className="text-gray-900 mb-2">Vehículos cargados: <strong className="text-green-600">{resultado.importados}</strong></p>
                  {resultado.errores > 0 && (
                    <p className="text-gray-900 mb-4">Errores (ignorados): <strong className="text-yellow-600">{resultado.errores}</strong></p>
                  )}
                  <p className="text-sm text-gray-600 mt-4">✨ Los vehículos ya están disponibles en <strong>Lista de Precios</strong></p>
                  <a href="/lista-precios" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                    Ver Lista de Precios →
                  </a>
                </div>
              ) : (
                <div>
                  <p className="text-red-700 font-bold mb-2">❌ Error en importación</p>
                  <p className="text-red-600">{resultado.error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}