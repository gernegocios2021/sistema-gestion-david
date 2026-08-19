import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS gastos_taller (
        id SERIAL PRIMARY KEY,
        vehiculo_id INTEGER REFERENCES vehiculos(id),
        tipo VARCHAR(100),
        descripcion TEXT,
        monto NUMERIC(12,2),
        fecha DATE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    return NextResponse.json({ 
      success: true, 
      message: 'Tabla gastos_taller creada' 
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}