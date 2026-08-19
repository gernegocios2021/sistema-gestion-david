import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    const result = await executeQuery(
      'SELECT * FROM ventas_vehiculos ORDER BY fecha_venta DESC'
    );
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { vehiculo_id, cliente_id, precio_venta, forma_pago, fecha_venta } =
      await req.json();

    // Obtener precio de compra del vehículo
    const vehiculoResult = await executeQuery(
      'SELECT precio_base FROM vehiculos WHERE id = $1',
      [vehiculo_id]
    );

    if (vehiculoResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Vehículo no encontrado' },
        { status: 404 }
      );
    }

    const precio_compra = parseFloat(vehiculoResult.rows[0].precio_base);
    const utilidad = precio_venta - precio_compra;
    const margen = ((utilidad / precio_compra) * 100).toFixed(2);

    // Registrar venta
    const result = await executeQuery(
      `INSERT INTO ventas_vehiculos 
       (vehiculo_id, cliente_id, precio_venta, forma_pago, utilidad, margen_porcentaje, fecha_venta)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [vehiculo_id, cliente_id, precio_venta, forma_pago, utilidad, margen, fecha_venta]
    );

    // Actualizar estado del vehículo
    await executeQuery(
      'UPDATE vehiculos SET estado = $1 WHERE id = $2',
      ['vendido', vehiculo_id]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error en POST /api/ventas:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}