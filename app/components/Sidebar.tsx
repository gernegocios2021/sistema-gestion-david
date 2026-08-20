'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/vehiculos', label: 'Vehículos', icon: '🚗' },
    { href: '/compras', label: 'Compras', icon: '📦' },
    { href: '/toma-de-usado', label: 'Toma de Usado', icon: '🔄' },
    { href: '/lista-precios', label: 'Lista de Precios', icon: '💰' },
    { href: '/ventas', label: 'Ventas', icon: '💳' },
    { href: '/clientes', label: 'Clientes', icon: '👥' },
    { href: '/gastos-taller', label: 'Gastos Taller', icon: '🔧' },
    { href: '/importar', label: 'Importar', icon: '📥' },
    { href: '/reportes', label: 'Reportes', icon: '📋' },
  ];

  return (
    <>
      {/* HAMBURGUESA MOBILE */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-40 bg-blue-600 text-white p-2 rounded"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed md:static left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col z-40 transform transition-transform md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* HEADER */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">GestiónPro</h1>
          <p className="text-sm text-gray-400">David Concesionario</p>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => {
              setSidebarOpen(false);
              // Aquí iría logout
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition"
          >
            <span>🚪</span>
            <span>Salir</span>
          </button>
        </div>
      </div>
    </>
  );
}