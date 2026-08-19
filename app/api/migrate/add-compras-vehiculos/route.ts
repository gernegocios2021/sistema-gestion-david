import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS compras_vehiculos (
        id SERIAL PRIMARY KEY,
        vehiculo_id INTEGER REFERENCES vehiculos(id),
        precio_compra NUMERIC(12,2),
        gastos_taller NUMERIC(12,2) DEFAULT 0,
        precio_venta_calculado NUMERIC(12,2),
        margen_porcentaje NUMERIC(5,2),
        fecha_compra DATE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await executeQuery(`
      CREATE TABLE IF NOT EXISTS coeficiente_margen (
        id SERIAL PRIMARY KEY,
        negocio_id INTEGER,
        coeficiente NUMERIC(4,2) DEFAULT 1.25,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    return NextResponse.json({ 
      success: true, 
      message: 'Tablas compras_vehiculos y coeficiente_margen creadas' 
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}