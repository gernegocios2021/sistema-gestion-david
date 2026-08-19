import { NextResponse } from 'next/server';
import { Pool } from 'pg';
export async function GET() {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const client = await pool.connect();

    // Crear tablas
    const schema = `
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(100),
  rol VARCHAR(50) DEFAULT 'vendedor',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehiculos (
  id SERIAL PRIMARY KEY,
  patente VARCHAR(10) UNIQUE NOT NULL,
  vin VARCHAR(17),
  marca VARCHAR(50),
  modelo VARCHAR(100),
  ano INTEGER,
  kilometros INTEGER,
  precio_base NUMERIC(12,2),
  precio_venta NUMERIC(12,2),
  estado VARCHAR(50) DEFAULT 'disponible',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  telefono VARCHAR(20),
  documento VARCHAR(20),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ventas_vehiculos (
  id SERIAL PRIMARY KEY,
  vehiculo_id INTEGER REFERENCES vehiculos(id),
  cliente_id INTEGER REFERENCES clientes(id),
  precio_venta NUMERIC(12,2) NOT NULL,
  forma_pago VARCHAR(50),
  utilidad NUMERIC(12,2),
  margen_porcentaje NUMERIC(5,2),
  fecha_venta DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
    `;

    await client.query(schema);
    await client.end();

    return NextResponse.json({ success: true, message: 'BD inicializada' });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}