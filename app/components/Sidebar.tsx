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
      {/* HAMBURGUESA - SOLO MOBILE */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-lg text-xl"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* OVERLAY - SOLO MOBILE */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR MOBILE - OVERLAY */}
      {sidebarOpen && (
        <div className="md:hidden fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col z-40">
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold">GestiónPro</h1>
            <p className="text-sm text-gray-400">David Concesionario</p>
          </div>

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
        </div>
      )}

      {/* SIDEBAR DESKTOP - SOLO EN DESKTOP */}
      <div className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex-col z-40">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">GestiónPro</h1>
          <p className="text-sm text-gray-400">David Concesionario</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
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

        <div className="p-4 border-t border-gray-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition">
            <span>🚪</span>
            <span>Salir</span>
          </button>
        </div>
      </div>
    </>
  );
}