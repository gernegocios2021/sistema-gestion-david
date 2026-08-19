import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { vehiculo_id, tipo, descripcion, monto, fecha } = await req.json();

    const result = await executeQuery(
      `INSERT INTO gastos_taller (vehiculo_id, tipo, descripcion, monto, fecha)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [vehiculo_id, tipo, descripcion, monto, fecha]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const vehiculo_id = searchParams.get('vehiculo_id');

    if (vehiculo_id) {
      const result = await executeQuery(
        'SELECT * FROM gastos_taller WHERE vehiculo_id = $1 ORDER BY fecha DESC',
        [vehiculo_id]
      );
      return NextResponse.json({ success: true, data: result.rows });
    }

    const result = await executeQuery('SELECT * FROM gastos_taller ORDER BY fecha DESC');
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}