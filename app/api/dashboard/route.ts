import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    // Total de ventas este mes
    const ventasResult = await executeQuery(`
      SELECT 
        COUNT(v.id) as total_ventas, 
        SUM(CAST(v.precio_venta AS NUMERIC)) as monto_ventas,
        SUM(CAST(v.utilidad AS NUMERIC)) as utilidad_bruta,
        COALESCE(SUM(CAST(gt.monto AS NUMERIC)), 0) as gastos_totales
      FROM ventas_vehiculos v
      LEFT JOIN gastos_taller gt ON v.vehiculo_id = gt.vehiculo_id
      WHERE DATE_TRUNC('month', v.fecha_venta) = DATE_TRUNC('month', NOW())
    `);

    const utilidad_neta = (parseFloat(ventas.utilidad_bruta) || 0) - (parseFloat(ventas.gastos_totales) || 0);

    // Stock actual
    const stockResult = await executeQuery(
      `SELECT COUNT(*) as total_stock, 
              SUM(CAST(precio_base AS NUMERIC)) as valor_stock
       FROM vehiculos 
       WHERE estado = 'disponible'`
    );

    // Últimas 5 ventas
    const ultimasVentasResult = await executeQuery(`
      SELECT v.id, v.precio_venta, v.utilidad, v.margen_porcentaje, 
             v.fecha_venta, veh.modelo, veh.patente, c.nombre, c.apellido
      FROM ventas_vehiculos v
      JOIN vehiculos veh ON v.vehiculo_id = veh.id
      JOIN clientes c ON v.cliente_id = c.id
      ORDER BY v.fecha_venta DESC
      LIMIT 5
    `);

    // Margen promedio
    const margenResult = await executeQuery(`
      SELECT AVG(CAST(margen_porcentaje AS NUMERIC)) as margen_promedio
      FROM ventas_vehiculos
      WHERE DATE_TRUNC('month', fecha_venta) = DATE_TRUNC('month', NOW())
    `);

    const ventas = ventasResult.rows[0];
    const stock = stockResult.rows[0];
    const margen = margenResult.rows[0];

    return NextResponse.json({
      success: true,
      data: {
        ventas_mes: {
          total_ventas: ventas.total_ventas || 0,
          monto_ventas: parseFloat(ventas.monto_ventas) || 0,
          utilidad_total: parseFloat(ventas.utilidad_total) || 0,
          margen_promedio: parseFloat(margen.margen_promedio) || 0
        },
        stock_actual: {
          total_vehiculos: stock.total_stock || 0,
          valor_total: parseFloat(stock.valor_stock) || 0
        },
        ultimas_ventas: ultimasVentasResult.rows
      }
    });
  } catch (error) {
    console.error('Error en Dashboard:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}