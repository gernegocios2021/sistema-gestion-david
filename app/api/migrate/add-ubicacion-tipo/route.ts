import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    await executeQuery(`
      ALTER TABLE vehiculos ADD COLUMN IF NOT EXISTS ubicacion VARCHAR(100) DEFAULT 'Oficina Cerro';
      ALTER TABLE vehiculos ADD COLUMN IF NOT EXISTS tipo_vehiculo VARCHAR(50) DEFAULT 'auto';
      ALTER TABLE vehiculos ADD COLUMN IF NOT EXISTS estado_ingreso VARCHAR(50) DEFAULT 'disponible';
    `);

    return NextResponse.json({ 
      success: true, 
      message: 'Campos agregados a vehiculos' 
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}