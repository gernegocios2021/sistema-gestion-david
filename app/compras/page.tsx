'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function ComprasPage() {
  const [compras, setCompras] = useState<any[]>([]);
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({
    vehiculo_id: '',
    precio_compra: 0,
    gastos_taller: 0,
    fecha_compra: new Date().toISOString().split('T')[0]
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/compras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const json = await res.json();
      
      if (json.success) {
        setCompras([json.data, ...compras]);
        setForm({
          vehiculo_id: '',
          precio_compra: 0,
          gastos_taller: 0,
          fecha_compra: new Date().toISOString().split('T')[0]
        });
        setMostrarForm(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const costoTotal = (comp: any) => parseFloat(comp.precio_compra) + parseFloat(comp.gastos_taller || 0);

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="md:ml-64 flex-1 bg-gray-50 min-h-screen p-4 md:p-8">        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Compras de Vehículos</h1>
            <button
              onClick={() => setMostrarForm(!mostrarForm)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              + Nueva Compra
            </button>
          </div>

          {mostrarForm && (
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Registrar Compra</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <select
                  value={form.vehiculo_id}
                  onChange={(e) => setForm({...form, vehiculo_id: e.target.value})}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                  required
                >
                  <option value="">Seleccionar Vehículo</option>
                  {vehiculos.map((v: any) => (
                    <option key={v.id} value={v.id}>
                      {v.patente} - {v.marca} {v.modelo}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Precio Compra"
                  value={form.precio_compra}
                  onChange={(e) => setForm({...form, precio_compra: parseFloat(e.target.value)})}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                  required
                />
                <input
                  type="number"
                  placeholder="Gastos Taller"
                  value={form.gastos_taller}
                  onChange={(e) => setForm({...form, gastos_taller: parseFloat(e.target.value)})}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                />
                <input
                  type="date"
                  value={form.fecha_compra}
                  onChange={(e) => setForm({...form, fecha_compra: e.target.value})}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                  required
                />
                <button
                  type="submit"
                  className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold"
                >
                  Guardar Compra
                </button>
              </form>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Historial de Compras</h2>
            {loading ? (
              <p className="text-gray-900">Cargando...</p>
            ) : compras.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Fecha</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Vehículo</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Precio Compra</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Gastos Taller</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Costo Total</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Precio Venta</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Margen</th>
                  </tr>
                </thead>
                <tbody>
                  {compras.map((c: any) => (
                    <tr key={c.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{new Date(c.fecha_compra).toLocaleDateString('es-AR')}</td>
                      <td className="py-3 px-4 text-gray-900">{c.vehiculo_id}</td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900">${Number(c.precio_compra).toLocaleString('es-AR')}</td>
                      <td className="py-3 px-4 text-right text-gray-900">${Number(c.gastos_taller).toLocaleString('es-AR')}</td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900">${costoTotal(c).toLocaleString('es-AR')}</td>
                      <td className="py-3 px-4 text-right font-semibold text-blue-600">${Number(c.precio_venta_calculado).toLocaleString('es-AR')}</td>
                      <td className="py-3 px-4 text-right font-semibold text-green-600">{Number(c.margen_porcentaje).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-900">No hay compras registradas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}