'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const MARCAS = ['Chevrolet', 'Ford', 'Toyota', 'Hyundai', 'Fiat', 'Renault', 'Volkswagen', 'Peugeot', 'Citroën', 'Nissan', 'Honda', 'Kia', 'Suzuki', 'Mazda', 'BMW', 'Mercedes-Benz'];

const ANOS = Array.from({length: 20}, (_, i) => new Date().getFullYear() - i);

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({
    patente: '',
    marca: '',
    modelo: '',
    ano: new Date().getFullYear(),
    kilometros: 0,
    precio_base: 0
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/vehiculos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const json = await res.json();
      
      if (json.success) {
        setVehiculos([json.data, ...vehiculos]);
        setForm({
          patente: '',
          marca: '',
          modelo: '',
          ano: new Date().getFullYear(),
          kilometros: 0,
          precio_base: 0
        });
        setMostrarForm(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="ml-64 flex-1 bg-gray-50 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Vehículos</h1>
            <button
              onClick={() => setMostrarForm(!mostrarForm)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              + Agregar Vehículo
            </button>
          </div>

          {mostrarForm && (
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Nuevo Vehículo</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Patente"
                  value={form.patente}
                  onChange={(e) => setForm({...form, patente: e.target.value.toUpperCase()})}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                  required
                />
                <select
                  value={form.marca}
                  onChange={(e) => setForm({...form, marca: e.target.value})}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                  required
                >
                  <option value="">Seleccionar Marca</option>
                  {MARCAS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Modelo (ej: Kardian, Ford K, etc)"
                  value={form.modelo}
                  onChange={(e) => setForm({...form, modelo: e.target.value})}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                  required
                />
                <select
                  value={form.ano}
                  onChange={(e) => setForm({...form, ano: parseInt(e.target.value)})}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                  required
                >
                  <option value="">Seleccionar Año</option>
                  {ANOS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Kilómetros"
                  value={form.kilometros}
                  onChange={(e) => setForm({...form, kilometros: parseInt(e.target.value)})}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                  required
                />
                <input
                  type="number"
                  placeholder="Precio Base"
                  value={form.precio_base}
                  onChange={(e) => setForm({...form, precio_base: parseFloat(e.target.value)})}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                  required
                />
                <button
                  type="submit"
                  className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold"
                >
                  Guardar
                </button>
              </form>
            </div>
          )}

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
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Precio Base</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {vehiculos.map((v: any) => (
                    <tr key={v.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold text-gray-900">{v.patente}</td>
                      <td className="py-3 px-4 text-gray-900">{v.marca} {v.modelo}</td>
                      <td className="py-3 px-4 text-gray-900">{v.ano}</td>
                      <td className="py-3 px-4 text-gray-900">{v.kilometros}</td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900">${Number(v.precio_base).toLocaleString('es-AR')}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded text-white text-xs font-semibold ${
                          v.estado === 'disponible' ? 'bg-green-600' : v.estado === 'vendido' ? 'bg-purple-600' : 'bg-yellow-600'
                        }`}>
                          {v.estado}
                        </span>
                      </td>
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