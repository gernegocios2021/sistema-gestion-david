import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    // Encontrar compras duplicadas (mismo vehiculo_id) y eliminar los más recientes
    await executeQuery(`
      DELETE FROM compras_vehiculos 
      WHERE id IN (
        SELECT id FROM compras_vehiculos 
        WHERE id NOT IN (
          SELECT MIN(id) FROM compras_vehiculos 
          GROUP BY vehiculo_id
        )
      )
    `);

    const result = await executeQuery('SELECT COUNT(*) as count FROM compras_vehiculos');
    const count = result.rows[0].count;

    return NextResponse.json({ 
      success: true, 
      message: `Duplicados eliminados. Quedan ${count} compras únicas.` 
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}