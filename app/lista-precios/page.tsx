'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function ListaPreciosPage() {
  const [compras, setCompras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/compras')
      .then((res) => res.json())
      .then((json) => {
        setCompras(json.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="ml-64 flex-1 bg-gray-50 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Lista de Precios - Disponibles para Venta</h1>

          <div className="bg-white p-6 rounded-lg shadow">
            {loading ? (
              <p className="text-gray-900">Cargando...</p>
            ) : compras.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {compras.map((c: any) => (
                  <div key={c.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900">Vehículo ID: {c.vehiculo_id}</h3>
                      <p className="text-gray-600 text-sm">Compra ID: {c.id}</p>
                    </div>
                    
                    <div className="space-y-3 border-b pb-4 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Precio Compra:</span>
                        <span className="font-semibold text-gray-900">${Number(c.precio_compra).toLocaleString('es-AR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gastos Taller:</span>
                        <span className="font-semibold text-gray-900">${Number(c.gastos_taller).toLocaleString('es-AR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Costo Total:</span>
                        <span className="font-semibold text-orange-600">
                          ${(parseFloat(c.precio_compra) + parseFloat(c.gastos_taller || 0)).toLocaleString('es-AR')}
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">💰 PRECIO DE VENTA</p>
                      <p className="text-3xl font-bold text-blue-600">
                        ${Number(c.precio_venta_calculado).toLocaleString('es-AR')}
                      </p>
                      <p className="text-sm text-green-600 mt-2">
                        Margen: {Number(c.margen_porcentaje).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-900 text-center py-8">No hay vehículos disponibles para venta</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}