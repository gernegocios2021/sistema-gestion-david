import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    const vehiculosRes = await executeQuery('SELECT COUNT(*) as count FROM vehiculos');
    const comprasRes = await executeQuery('SELECT COUNT(*) as count FROM compras_vehiculos');
    
    const vehiculos = vehiculosRes.rows[0].count;
    const compras = comprasRes.rows[0].count;

    return NextResponse.json({ 
      vehiculos,
      compras,
      diferencia: vehiculos - compras
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}