import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { precio_final, estado_peritaje } = await req.json();

    const result = await executeQuery(
      'UPDATE toma_de_usado SET precio_final = $1, estado_peritaje = $2 WHERE id = $3 RETURNING *',
      [precio_final, estado_peritaje, id]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}