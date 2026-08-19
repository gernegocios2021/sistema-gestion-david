'use client';

import { useEffect, useState } from 'react';

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
  if (!data) return <div className="p-8">Error cargando datos</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard - David Concesionario</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-600 mb-2">Utilidad Total (Mes)</p>
            <p className="text-3xl font-bold text-green-600">
              ${data.ventas_mes.utilidad_total.toLocaleString('es-AR')}
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
            <p className="text-3xl font-bold text-orange-600">{data.ventas_mes.margen_promedio.toFixed(1)}%</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Últimas Ventas</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Fecha</th>
                <th className="text-left py-3 px-4">Vehículo</th>
                <th className="text-left py-3 px-4">Cliente</th>
                <th className="text-right py-3 px-4">Precio Venta</th>
                <th className="text-right py-3 px-4">Utilidad</th>
              </tr>
            </thead>
            <tbody>
              {data.ultimas_ventas.map((venta: any) => (
                <tr key={venta.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{new Date(venta.fecha_venta).toLocaleDateString('es-AR')}</td>
                  <td className="py-3 px-4">{venta.modelo} ({venta.patente})</td>
                  <td className="py-3 px-4">{venta.nombre} {venta.apellido}</td>
                  <td className="py-3 px-4 text-right font-semibold">${parseFloat(venta.precio_venta).toLocaleString('es-AR')}</td>
                  <td className="py-3 px-4 text-right font-semibold text-green-600">
                    ${parseFloat(venta.utilidad).toLocaleString('es-AR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}