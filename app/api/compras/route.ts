import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { vehiculo_id, precio_compra, gastos_taller, fecha_compra, comision_vendedor } = await req.json();

    // Obtener coeficiente (por ahora hardcoded a 1.25)
    const coeficiente = 1.25;
    const comision = comision_vendedor || 3; // % por defecto
    
    // Calcular precio de venta
    const costo_total = parseFloat(precio_compra) + parseFloat(gastos_taller || 0);
    const precio_venta = costo_total * coeficiente;
    const margen = ((precio_venta - costo_total) / costo_total) * 100;
    
    // Calcular monto de comisión
    const monto_comision = (precio_venta * comision) / 100;

    // Registrar compra
    const result = await executeQuery(
      `INSERT INTO compras_vehiculos (vehiculo_id, precio_compra, gastos_taller, precio_venta_calculado, margen_porcentaje, fecha_compra, comision_vendedor, monto_comision)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [vehiculo_id, precio_compra, gastos_taller || 0, precio_venta, margen, fecha_compra, comision, monto_comision]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}