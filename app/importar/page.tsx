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
      const allData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

      // Detectar secciones por la columna A (primera columna)
      const secciones = {
        autos: { datos: [] as any[], headers: [] as string[], ubicacion: 'Oficina Cerro', tipo: 'auto' },
        motos: { datos: [] as any[], headers: [] as string[], ubicacion: 'Oficina Cerro', tipo: 'moto' },
        nuevos_ingresos: { datos: [] as any[], headers: [] as string[], ubicacion: 'Oficina Cerro', tipo: 'auto' },
        carlos_paz: { datos: [] as any[], headers: [] as string[], ubicacion: 'Local Carlos Paz', tipo: 'auto' }
      };

      let currentSeccion = 'autos';
      let headerRow = -1;

      for (let i = 0; i < allData.length; i++) {
        const row = allData[i];
        const firstCell = String(row[0] || '').toUpperCase().trim();

        // Cambiar sección
        if (firstCell.includes('MOTOS') && !firstCell.includes('AUTOS')) {
          currentSeccion = 'motos';
          headerRow = -1;
          continue;
        }
        if (firstCell.includes('NUEVOS INGRESOS') || firstCell.includes('NUEVOS INGRESOS')) {
          currentSeccion = 'nuevos_ingresos';
          headerRow = -1;
          continue;
        }
        if (firstCell.includes('CARLOS PAZ') || firstCell.includes('LOCAL')) {
          currentSeccion = 'carlos_paz';
          headerRow = -1;
          continue;
        }

        // Detectar encabezado
        if (row.some((cell: any) => String(cell || '').toUpperCase().includes('DOMINIO') || String(cell || '').toUpperCase().includes('MARCA'))) {
          secciones[currentSeccion as keyof typeof secciones].headers = row.map((h: any) => String(h || '').trim());
          headerRow = i;
          continue;
        }

        // Agregar datos si hay encabezado
        if (headerRow >= 0 && i > headerRow) {
          const patente = String(row[4] || '').trim();
          const precio = String(row[7] || '').trim();

          if (patente && patente.length > 2 && precio && precio !== '-') {
            secciones[currentSeccion as keyof typeof secciones].datos.push(row);
          }
        }
      }

      // Procesar cada sección
      let totalImportados = 0;
      let totalErrores = 0;
      const detallesSecciones = [];

      for (const [nombre, seccion] of Object.entries(secciones)) {
        if (seccion.datos.length === 0 || seccion.headers.length === 0) continue;

        const datosObjetos = seccion.datos.map((row: any[]) => {
          const obj: any = {};
          seccion.headers.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        });

        const res = await fetch('/api/importar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            datos: datosObjetos,
            ubicacion: seccion.ubicacion,
            tipo_vehiculo: seccion.tipo,
            estado_ingreso: 'disponible'
          })
        });

        const json = await res.json();
        if (json.success) {
          totalImportados += json.importados;
          totalErrores += json.errores;
          detallesSecciones.push({
            seccion: nombre,
            cantidad: json.importados,
            ubicacion: seccion.ubicacion,
            tipo: seccion.tipo
          });
        }
      }

      setResultado({
        success: true,
        importados: totalImportados,
        errores: totalErrores,
        detalles: detallesSecciones
      });
    } catch (error) {
      setResultado({ error: String(error), success: false });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="md:ml-64 flex-1 bg-gray-50 min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">📥 Importar Lista de Precios</h1>

          <div className="bg-white p-8 rounded-lg shadow mb-8">
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
              <p className="text-gray-900 font-semibold mb-2">Sube tu Excel completo</p>
              <p className="text-gray-600 text-sm mb-4">Detecta automáticamente: AUTOS, MOTOS, NUEVOS INGRESOS, LOCAL CARLOS PAZ</p>
              <label className="cursor-pointer inline-block">
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={handleFileUpload}
                  disabled={cargando}
                  className="hidden"
                />
                <span className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block font-semibold">
                  📁 Seleccionar archivo
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
                  <p className="text-gray-900 mb-4">Total vehículos cargados: <strong className="text-green-600">{resultado.importados}</strong></p>
                  
                  {resultado.detalles && resultado.detalles.length > 0 && (
                    <div className="mb-4 space-y-2">
                      <p className="font-semibold text-gray-900">Detalles por sección:</p>
                      {resultado.detalles.map((d: any, i: number) => (
                        <p key={i} className="text-sm text-gray-700">
                          • {d.seccion}: {d.cantidad} vehículos ({d.tipo}, {d.ubicacion})
                        </p>
                      ))}
                    </div>
                  )}

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
                  <p className="text-red-700 font-bold mb-2">❌ Error</p>
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