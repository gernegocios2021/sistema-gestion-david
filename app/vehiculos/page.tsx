'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const MARCAS = ['Chevrolet', 'Ford', 'Toyota', 'Hyundai', 'Fiat', 'Renault', 'Volkswagen', 'Peugeot', 'Citroën', 'Nissan', 'Honda', 'Kia', 'Suzuki', 'Mazda', 'BMW', 'Mercedes-Benz'];
const ANOS = Array.from({length: 20}, (_, i) => new Date().getFullYear() - i);

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [busqueda, setBusqueda] = useState('');

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

  // FILTRO
  const vehiculosFiltrados = vehiculos.filter((v: any) => {
    const busquedaLower = busqueda.toLowerCase();
    return (
      v.patente.toLowerCase().includes(busquedaLower) ||
      v.marca.toLowerCase().includes(busquedaLower) ||
      v.modelo.toLowerCase().includes(busquedaLower) ||
      (v.combustible && v.combustible.toLowerCase().includes(busquedaLower))
    );
  });

  const handleEditar = (vehiculo: any) => {
    setEditandoId(vehiculo.id);
    setEditForm(vehiculo);
  };

  const handleGuardarEdicion = async () => {
    try {
      const res = await fetch(`/api/vehiculos/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      const json = await res.json();
      if (json.success) {
        setVehiculos(vehiculos.map(v => v.id === editandoId ? json.data : v));
        setEditandoId(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEliminar = async (id: number) => {
    if (confirm('¿Eliminar este vehículo? Se eliminarán también sus compras.')) {
      try {
        const res = await fetch(`/api/vehiculos/${id}`, {
          method: 'DELETE'
        });

        const json = await res.json();
        if (json.success) {
          setVehiculos(vehiculos.filter(v => v.id !== id));
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const formatNumero = (valor: number) => {
    return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="md:ml-64 flex-1 bg-gray-50 min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Vehículos</h1>
            <p className="text-gray-600 text-sm mt-2">Solo lectura y edición. Los vehículos se agregan desde COMPRAS o TOMA DE USADO</p>
          </div>

          {/* BUSCADOR */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <input
              type="text"
              placeholder="🔍 Buscar por patente, marca, modelo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            {loading ? (
              <p className="text-gray-900 p-4">Cargando...</p>
            ) : vehiculosFiltrados.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-100">
                      <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-900">Patente</th>
                      <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-900">Marca/Modelo</th>
                      <th className="hidden sm:table-cell text-left py-3 px-3 md:px-4 font-semibold text-gray-900">Año</th>
                      <th className="hidden md:table-cell text-left py-3 px-3 md:px-4 font-semibold text-gray-900">KM</th>
                      <th className="hidden lg:table-cell text-left py-3 px-3 md:px-4 font-semibold text-gray-900">Tipo</th>
                      <th className="text-center py-3 px-3 md:px-4 font-semibold text-gray-900">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehiculosFiltrados.map((v: any) => (
                      <tr key={v.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-3 md:px-4 font-semibold text-gray-900">{v.patente}</td>
                        <td className="py-3 px-3 md:px-4 text-gray-900">{v.marca} {v.modelo}</td>
                        <td className="hidden sm:table-cell py-3 px-3 md:px-4 text-gray-900">{v.ano}</td>
                        <td className="hidden md:table-cell py-3 px-3 md:px-4 text-gray-900">{formatNumero(v.kilometros)}</td>
                        <td className="hidden lg:table-cell py-3 px-3 md:px-4 text-gray-900">{v.tipo_vehiculo || 'auto'}</td>
                        <td className="py-3 px-3 md:px-4 text-center">
                          <div className="flex gap-2 justify-center flex-wrap">
                            <button
                              onClick={() => handleEditar(v)}
                              className="bg-blue-600 text-white px-2 md:px-3 py-1 rounded text-xs hover:bg-blue-700"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => handleEliminar(v.id)}
                              className="bg-red-600 text-white px-2 md:px-3 py-1 rounded text-xs hover:bg-red-700"
                            >
                              🗑️ Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-900 text-center py-8">
                {busqueda ? 'No se encontraron vehículos' : 'No hay vehículos registrados'}
              </p>
            )}
          </div>
        </div>

        {/* MODAL EDITAR */}
        {editandoId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Editar Vehículo</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Patente</label>
                  <input
                    type="text"
                    value={editForm.patente || ''}
                    onChange={(e) => setEditForm({...editForm, patente: e.target.value.toUpperCase()})}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Marca</label>
                  <select
                    value={editForm.marca || ''}
                    onChange={(e) => setEditForm({...editForm, marca: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                  >
                    <option value="">Seleccionar</option>
                    {MARCAS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Modelo</label>
                  <input
                    type="text"
                    value={editForm.modelo || ''}
                    onChange={(e) => setEditForm({...editForm, modelo: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Año</label>
                  <select
                    value={editForm.ano || ''}
                    onChange={(e) => setEditForm({...editForm, ano: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                  >
                    {ANOS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Kilómetros</label>
                  <input
                    type="number"
                    value={editForm.kilometros || 0}
                    onChange={(e) => setEditForm({...editForm, kilometros: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Combustible</label>
                  <select
                    value={editForm.combustible || ''}
                    onChange={(e) => setEditForm({...editForm, combustible: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Nafta">Nafta</option>
                    <option value="Diesel">Diesel</option>
                    <option value="GNC">GNC</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Versión</label>
                  <input
                    type="text"
                    value={editForm.version || ''}
                    onChange={(e) => setEditForm({...editForm, version: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Ubicación</label>
                  <select
                    value={editForm.ubicacion || ''}
                    onChange={(e) => setEditForm({...editForm, ubicacion: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                  >
                    <option value="Oficina Cerro">Oficina Cerro</option>
                    <option value="Local Carlos Paz">Local Carlos Paz</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Tipo</label>
                  <select
                    value={editForm.tipo_vehiculo || 'auto'}
                    onChange={(e) => setEditForm({...editForm, tipo_vehiculo: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                  >
                    <option value="auto">Auto</option>
                    <option value="moto">Moto</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm text-gray-600 mb-1 block">Observaciones</label>
                <textarea
                  value={editForm.observaciones || ''}
                  onChange={(e) => setEditForm({...editForm, observaciones: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleGuardarEdicion}
                  className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditandoId(null)}
                  className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500 font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}