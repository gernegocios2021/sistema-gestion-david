'use client';

import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Cargando...</div>;
  
  if (!data || !data.ventas_mes) {
    return <div className="p-8">Error cargando datos</div>;
  }

  const utilidadNeta = data.ventas_mes.utilidad_neta || data.ventas_mes.utilidad_total || 0;

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="ml-64 flex-1 bg-gray-50 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-600 mb-2">Utilidad Neta (Mes)</p>
              <p className="text-3xl font-bold text-green-600">
                ${Number(utilidadNeta).toLocaleString('es-AR')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-600 mb-2">Ventas (Mes)</p>
              <p className="text-3xl font-bold text-blue-600">{data.ventas_mes.total_ventas}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-600 mb-2">Stock Disponible</p>
              <p className="text-3xl font-bold text-purple-600">{data.stock_actual.total_vehiculos}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-600 mb-2">Margen Promedio</p>
              <p className="text-3xl font-bold text-orange-600">{Number(data.ventas_mes.margen_promedio).toFixed(1)}%</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Últimas Ventas</h2>
            {data.ultimas_ventas && data.ultimas_ventas.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="text-left py-3 px-4 text-gray-900 font-semibold">Fecha</th>
                    <th className="text-left py-3 px-4 text-gray-900 font-semibold">Vehículo</th>
                    <th className="text-left py-3 px-4 text-gray-900 font-semibold">Cliente</th>
                    <th className="text-right py-3 px-4 text-gray-900 font-semibold">Precio Venta</th>
                    <th className="text-right py-3 px-4 text-gray-900 font-semibold">Utilidad Neta</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ultimas_ventas.map((venta: any) => (
                    <tr key={venta.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{new Date(venta.fecha_venta).toLocaleDateString('es-AR')}</td>
                      <td className="py-3 px-4 text-gray-900">{venta.modelo} ({venta.patente})</td>
                      <td className="py-3 px-4 text-gray-900">{venta.nombre} {venta.apellido || ''}</td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900">${Number(venta.precio_venta).toLocaleString('es-AR')}</td>
                      <td className="py-3 px-4 text-right font-semibold text-green-600">
                        ${Number(venta.utilidad).toLocaleString('es-AR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No hay ventas registradas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}