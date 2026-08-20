'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const MARCAS = ['Chevrolet', 'Ford', 'Toyota', 'Hyundai', 'Fiat', 'Renault', 'Volkswagen', 'Peugeot', 'Citroën', 'Nissan', 'Honda', 'Kia', 'Suzuki', 'Mazda', 'BMW', 'Mercedes-Benz'];
const ANOS = Array.from({length: 20}, (_, i) => new Date().getFullYear() - i);

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/vehiculos')
      .then((res) => res.json())
      .then((json) => {
        setVehiculos(json.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const formatNumero = (valor: number) => {
    return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="md:ml-64 flex-1 bg-gray-50 min-h-screen p-4 md:p-8">        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Vehículos Disponibles</h1>
            <p className="text-gray-600 text-sm mt-2">💡 Solo visualización. Los vehículos se agregan desde COMPRAS o TOMA DE USADO</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Listado de Vehículos</h2>
            {loading ? (
              <p className="text-gray-900">Cargando...</p>
            ) : vehiculos.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Patente</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Marca/Modelo</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Año</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">KM</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Combustible</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Versión</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Primera Mano</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {vehiculos.map((v: any) => (
                    <tr key={v.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold text-gray-900">{v.patente}</td>
                      <td className="py-3 px-4 text-gray-900">{v.marca} {v.modelo}</td>
                      <td className="py-3 px-4 text-gray-900">{v.ano}</td>
                      <td className="py-3 px-4 text-gray-900">{formatNumero(v.kilometros)}</td>
                      <td className="py-3 px-4 text-gray-900">{v.combustible || 'N/A'}</td>
                      <td className="py-3 px-4 text-gray-900">{v.version || 'N/A'}</td>
                      <td className="py-3 px-4 text-gray-900">{v.primera_mano ? '✅ Sí' : '❌ No'}</td>
                      <td className="py-3 px-4 text-gray-900 text-xs">{v.observaciones || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-900">No hay vehículos registrados</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}