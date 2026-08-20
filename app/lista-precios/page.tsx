'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function ListaPreciosPage() {
  const [compras, setCompras] = useState<any[]>([]);
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroUbicacion, setFiltroUbicacion] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

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

  // Obtener ubicaciones y tipos únicos
  const ubicaciones = [...new Set(vehiculos.map((v: any) => v.ubicacion).filter(Boolean))];
  const tipos = [...new Set(vehiculos.map((v: any) => v.tipo_vehiculo).filter(Boolean))];

  // Filtrar compras
  const comprasFiltradas = compras.filter((c: any) => {
    const vehiculo = getVehiculo(c.vehiculo_id);
    if (!vehiculo) return false;

    const busquedaLower = busqueda.toLowerCase();
    const coincideBusqueda =
      vehiculo.marca.toLowerCase().includes(busquedaLower) ||
      vehiculo.modelo.toLowerCase().includes(busquedaLower) ||
      vehiculo.patente.toLowerCase().includes(busquedaLower) ||
      vehiculo.combustible?.toLowerCase().includes(busquedaLower) ||
      vehiculo.version?.toLowerCase().includes(busquedaLower);

    const coincideUbicacion = !filtroUbicacion || vehiculo.ubicacion === filtroUbicacion;
    const coincideTipo = !filtroTipo || vehiculo.tipo_vehiculo === filtroTipo;

    return coincideBusqueda && coincideUbicacion && coincideTipo;
  });

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="md:ml-64 flex-1 bg-gray-50 min-h-screen p-4 md:p-8">        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Lista de Precios</h1>
          <p className="text-gray-600 mb-6">Vehículos disponibles para venta</p>

          {/* FILTROS */}
          <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-4">
            <input
              type="text"
              placeholder="🔍 Buscar por marca, modelo, patente..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <select
                value={filtroUbicacion}
                onChange={(e) => setFiltroUbicacion(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white"
              >
                <option value="">📍 Todas las ubicaciones</option>
                {ubicaciones.map((ub) => (
                  <option key={ub} value={ub}>{ub}</option>
                ))}
              </select>

              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white"
              >
                <option value="">🚗 Todos los tipos</option>
                {tipos.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo === 'moto' ? '🏍️ Motos' : '🚗 Autos'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            {loading ? (
              <p className="text-gray-900">Cargando...</p>
            ) : comprasFiltradas.length > 0 ? (
              <>
                <p className="text-sm text-gray-600 mb-4">{comprasFiltradas.length} vehículos encontrados</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {comprasFiltradas.map((c: any) => {
                    const vehiculo = getVehiculo(c.vehiculo_id);
                    return (
                      <div key={c.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-white">
                        <div className="mb-2">
                          <p className="text-xs text-gray-500 mb-1">
                            {vehiculo?.tipo_vehiculo === 'moto' ? '🏍️' : '🚗'} {vehiculo?.ubicacion}
                          </p>
                          <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                            {vehiculo?.marca} {vehiculo?.modelo}
                          </h3>
                          <p className="text-sm font-semibold text-blue-600">
                            {vehiculo?.patente}
                          </p>
                        </div>

                        <div className="space-y-1 text-xs mb-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Año:</span>
                            <span className="font-semibold text-gray-900">{vehiculo?.ano}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">KM:</span>
                            <span className="font-semibold text-gray-900">{formatNumero(vehiculo?.kilometros)}</span>
                          </div>
                          {vehiculo?.combustible && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">⛽:</span>
                              <span className="font-semibold text-gray-900">{vehiculo?.combustible}</span>
                            </div>
                          )}
                        </div>

                        <div className="bg-green-100 p-3 rounded border border-green-300">
                          <p className="text-xs text-gray-700 mb-1">💰 PRECIO</p>
                          <p className="text-lg font-bold text-green-700">
                            ${formatNumero(Math.round(parseFloat(c.precio_venta_calculado)))}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-gray-900 text-center py-8">
                {busqueda ? 'No se encontraron vehículos' : 'No hay vehículos disponibles para venta'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}