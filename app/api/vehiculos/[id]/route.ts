import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { marca, modelo, ano, kilometros, combustible, version, observaciones, ubicacion, tipo_vehiculo } = body;

    const result = await executeQuery(
      `UPDATE vehiculos SET marca=$1, modelo=$2, ano=$3, kilometros=$4, combustible=$5, version=$6, observaciones=$7, ubicacion=$8, tipo_vehiculo=$9 
       WHERE id=$10 RETURNING *`,
      [marca, modelo, ano, kilometros, combustible, version, observaciones, ubicacion, tipo_vehiculo, id]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Eliminar compras primero
    await executeQuery('DELETE FROM compras_vehiculos WHERE vehiculo_id=$1', [id]);
    
    // Luego eliminar vehículo
    await executeQuery('DELETE FROM vehiculos WHERE id=$1', [id]);

    return NextResponse.json({ success: true, message: 'Vehículo eliminado' });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}