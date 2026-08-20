import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    await executeQuery(`
      ALTER TABLE compras_vehiculos ADD COLUMN IF NOT EXISTS comision_vendedor NUMERIC(5,2) DEFAULT 3;
      ALTER TABLE compras_vehiculos ADD COLUMN IF NOT EXISTS monto_comision NUMERIC(12,2) DEFAULT 0;
    `);

    return NextResponse.json({ 
      success: true, 
      message: 'Comisión agregada a compras' 
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}