import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ vehiculo_id: string }> }
) {
  try {
    const { vehiculo_id } = await params;
    
    const result = await executeQuery(
      'SELECT * FROM compras_vehiculos WHERE vehiculo_id = $1 ORDER BY fecha_compra DESC LIMIT 1',
      [vehiculo_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'No hay compra registrada' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}