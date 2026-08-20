import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS toma_de_usado (
        id SERIAL PRIMARY KEY,
        patente VARCHAR(20),
        marca VARCHAR(100),
        modelo VARCHAR(100),
        ano INTEGER,
        kilometros INTEGER,
        combustible VARCHAR(50),
        version VARCHAR(100),
        estado_general TEXT,
        precio_inicial NUMERIC(12,2),
        precio_final NUMERIC(12,2),
        vendedor VARCHAR(100),
        cliente VARCHAR(100),
        estado_peritaje VARCHAR(50),
        observaciones TEXT,
        fecha_registro TIMESTAMP DEFAULT NOW()
      )
    `);

    return NextResponse.json({ success: true, message: 'Tabla toma_de_usado creada' });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}