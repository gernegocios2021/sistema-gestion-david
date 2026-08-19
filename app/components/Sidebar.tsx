'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0 pt-8">
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-bold">GestiónPro</h1>
        <p className="text-gray-400 text-sm">David Concesionario</p>
      </div>

      <nav className="space-y-2 px-4">
        <Link
          href="/"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive('/') 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <span>📊</span> Dashboard
        </Link>

        <Link
          href="/vehiculos"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive('/vehiculos') 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <span>🚗</span> Vehículos
        </Link>

                <Link
          href="/compras"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive('/compras') 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <span>📦</span> Compras
        </Link>

        <Link
          href="/ventas"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive('/ventas') 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <span>💰</span> Ventas
        </Link>

        <Link
          href="/clientes"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive('/clientes') 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <span>👥</span> Clientes
        </Link>

        <Link
          href="/gastos"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive('/gastos') 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <span>🔧</span> Gastos Taller
        </Link>

        <Link
          href="/reportes"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive('/reportes') 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <span>📈</span> Reportes
        </Link>
      </nav>

      <div className="absolute bottom-8 left-4 right-4 border-t border-gray-700 pt-4">
        <button className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-gray-800 rounded-lg">
          <span>🚪</span> Salir
        </button>
      </div>
    </div>
  );
}