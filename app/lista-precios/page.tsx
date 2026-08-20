'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function ListaPreciosPage() {
  const [compras, setCompras] = useState<any[]>([]);
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/compras').then((r) => r.json()),
      fetch('/api/vehiculos').then((r) => r.json())
    ])
      .then(([comprasData, vehiculosData]) => {
        setCompras(comprasData.data || []);
        setVehiculos(vehiculosData.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getVehiculo = (vehiculo_id: number) => {
    return vehiculos.find((v: any) => v.id === vehiculo_id);
  };

  const formatNumero = (valor: number) => {
    return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="ml-64 flex-1 bg-gray-50 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Lista de Precios</h1>
          <p className="text-gray-600 mb-8">Vehículos disponibles para venta</p>

          <div className="bg-white p-6 rounded-lg shadow">
            {loading ? (
              <p className="text-gray-900">Cargando...</p>
            ) : compras.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {compras.map((c: any) => {
                  const vehiculo = getVehiculo(c.vehiculo_id);
                  return (
                    <div key={c.id} className="border-2 border-blue-200 rounded-lg p-6 hover:shadow-lg transition bg-gradient-to-br from-white to-blue-50">
                      <div className="mb-4 pb-4 border-b-2 border-blue-100">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {vehiculo?.marca} {vehiculo?.modelo}
                        </h3>
                        <p className="text-lg font-semibold text-blue-600">
                          🚗 {vehiculo?.patente}
                        </p>
                      </div>

                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between">
                          <span className="text-gray-700">📅 Año:</span>
                          <span className="font-semibold text-gray-900">{vehiculo?.ano}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">📏 Kilómetros:</span>
                          <span className="font-semibold text-gray-900">{formatNumero(vehiculo?.kilometros)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">⚙️ Versión:</span>
                          <span className="font-semibold text-gray-900">{vehiculo?.version || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">⛽ Combustible:</span>
                          <span className="font-semibold text-gray-900">{vehiculo?.combustible || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">✋ Primera Mano:</span>
                          <span className="font-semibold text-gray-900">
                            {vehiculo?.primera_mano ? '✅ Sí' : '❌ No'}
                          </span>
                        </div>
                      </div>

                      {vehiculo?.observaciones && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-6 rounded">
                          <p className="text-sm text-gray-700 font-semibold mb-1">📝 Observaciones:</p>
                          <p className="text-sm text-gray-900">{vehiculo?.observaciones}</p>
                        </div>
                      )}

                      <div className="bg-green-100 p-4 rounded-lg border-2 border-green-600">
                        <p className="text-sm text-gray-700 mb-2 font-semibold">💰 PRECIO DE VENTA</p>
                        <p className="text-4xl font-bold text-green-700">
                          ${formatNumero(Math.round(parseFloat(c.precio_venta_calculado)))}
                        </p>
                        <p className="text-sm text-green-600 mt-3 font-semibold">
                          🎁 Tu comisión: {Number(c.comision_vendedor).toFixed(1)}% (${formatNumero(Math.round(parseFloat(c.monto_comision)))})
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-900 text-center py-8 text-lg">No hay vehículos disponibles para venta</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}