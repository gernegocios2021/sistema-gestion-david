'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function TomaDeUsadoPage() {
  const [tomaDeUsado, setTomaDeUsado] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [peritajeMode, setPeritajeMode] = useState<number | null>(null);
  const [precioFinal, setPrecioFinal] = useState(0);
  
  const [form, setForm] = useState({
    patente: '',
    marca: '',
    modelo: '',
    ano: new Date().getFullYear(),
    kilometros: 0,
    combustible: '',
    version: '',
    estado_general: '',
    precio_inicial: 0,
    vendedor: '',
    cliente: '',
    observaciones: ''
  });

  useEffect(() => {
    fetch('/api/toma-de-usado')
      .then((res) => res.json())
      .then((json) => {
        setTomaDeUsado(json.data || []);
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
      const res = await fetch('/api/toma-de-usado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const json = await res.json();
      
      if (json.success) {
        setTomaDeUsado([json.data, ...tomaDeUsado]);
        setForm({
          patente: '',
          marca: '',
          modelo: '',
          ano: new Date().getFullYear(),
          kilometros: 0,
          combustible: '',
          version: '',
          estado_general: '',
          precio_inicial: 0,
          vendedor: '',
          cliente: '',
          observaciones: ''
        });
        setMostrarForm(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePeritaje = async (id: number) => {
    try {
      const res = await fetch(`/api/toma-de-usado/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ precio_final: precioFinal, estado_peritaje: 'aprobado' })
      });
      
      const json = await res.json();
      
      if (json.success) {
        setTomaDeUsado(tomaDeUsado.map(t => t.id === id ? json.data : t));
        setPeritajeMode(null);
        setPrecioFinal(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatNumero = (valor: number) => {
    return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="md:ml-64 flex-1 bg-gray-50 min-h-screen p-4 md:p-8">        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Toma de Usado</h1>
              <p className="text-gray-600 text-sm mt-2">Vehículos recibidos como parte de pago</p>
            </div>
            <button
              onClick={() => setMostrarForm(!mostrarForm)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              + Nuevo Ingreso
            </button>
          </div>

          {mostrarForm && (
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Registrar Toma de Usado</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Patente"
                  value={form.patente}
                  onChange={(e) => setForm({...form, patente: e.target.value.toUpperCase()})}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Marca"
                  value={form.marca}
                  onChange={(e) => setForm({...form, marca: e.target.value})}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Modelo"
                  value={form.modelo}
                  onChange={(e) => setForm({...form, modelo: e.target.value})}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                  required
                />
                <select
                  value={form.ano}
                  onChange={(e) => setForm({...form, ano: parseInt(e.target.value)})}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                >
                  {Array.from({length: 20}, (_, i) => new Date().getFullYear() - i).map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Kilómetros"
                  value={form.kilometros}
                  onChange={(e) => setForm({...form, kilometros: parseInt(e.target.value)})}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                />
                <select
                  value={form.combustible}
                  onChange={(e) => setForm({...form, combustible: e.target.value})}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                >
                  <option value="">Combustible</option>
                  <option value="Nafta">Nafta</option>
                  <option value="Diesel">Diesel</option>
                  <option value="GNC">GNC</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
                <input
                  type="text"
                  placeholder="Versión"
                  value={form.version}
                  onChange={(e) => setForm({...form, version: e.target.value})}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                />
                <input
                  type="text"
                  placeholder="Vendedor (nombre)"
                  value={form.vendedor}
                  onChange={(e) => setForm({...form, vendedor: e.target.value})}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                />
                <input
                  type="text"
                  placeholder="Cliente (nombre)"
                  value={form.cliente}
                  onChange={(e) => setForm({...form, cliente: e.target.value})}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                />
                <textarea
                  placeholder="Estado General del vehículo"
                  value={form.estado_general}
                  onChange={(e) => setForm({...form, estado_general: e.target.value})}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white col-span-2"
                  rows={2}
                />
                <input
                  type="number"
                  placeholder="Precio Inicial (tasación)"
                  value={form.precio_inicial}
                  onChange={(e) => setForm({...form, precio_inicial: parseFloat(e.target.value)})}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                />
                <textarea
                  placeholder="Observaciones"
                  value={form.observaciones}
                  onChange={(e) => setForm({...form, observaciones: e.target.value})}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                  rows={2}
                />
                <button
                  type="submit"
                  className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold"
                >
                  Registrar Ingreso
                </button>
              </form>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Historial de Tomas de Usado</h2>
            {loading ? (
              <p className="text-gray-900">Cargando...</p>
            ) : tomaDeUsado.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Patente</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Auto</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Vendedor</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Cliente</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Precio Inicial</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Precio Final</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Estado</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {tomaDeUsado.map((t: any) => (
                    <tr key={t.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold text-gray-900">{t.patente}</td>
                      <td className="py-3 px-4 text-gray-900">{t.marca} {t.modelo} ({t.ano})</td>
                      <td className="py-3 px-4 text-gray-900">{t.vendedor}</td>
                      <td className="py-3 px-4 text-gray-900">{t.cliente}</td>
                      <td className="py-3 px-4 text-right text-gray-900">${formatNumero(Math.round(t.precio_inicial))}</td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900">
                        {t.precio_final ? `$${formatNumero(Math.round(t.precio_final))}` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded text-white text-xs font-semibold ${
                          t.estado_peritaje === 'pendiente' ? 'bg-yellow-600' : 'bg-green-600'
                        }`}>
                          {t.estado_peritaje === 'pendiente' ? '⏳ Pendiente' : '✅ Aprobado'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {t.estado_peritaje === 'pendiente' && (
                          <button
                            onClick={() => setPeritajeMode(t.id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                          >
                            Perítear
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-900">No hay tomas de usado registradas</p>
            )}
          </div>

          {peritajeMode && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Definir Precio Final</h3>
                <input
                  type="number"
                  placeholder="Precio Final $"
                  value={precioFinal}
                  onChange={(e) => setPrecioFinal(parseFloat(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white w-full mb-4"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePeritaje(peritajeMode)}
                    className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => setPeritajeMode(null)}
                    className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}