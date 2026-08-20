import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { patente, marca, modelo, ano, kilometros, combustible, version, estado_general, precio_inicial, vendedor, cliente, observaciones } = await req.json();

    const result = await executeQuery(
      `INSERT INTO toma_de_usado (patente, marca, modelo, ano, kilometros, combustible, version, estado_general, precio_inicial, precio_final, vendedor, cliente, estado_peritaje, observaciones, fecha_registro)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pendiente', $13, NOW())
       RETURNING *`,
      [patente, marca, modelo, ano, kilometros, combustible, version, estado_general, precio_inicial, null, vendedor, cliente, observaciones]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await executeQuery(
      'SELECT * FROM toma_de_usado ORDER BY fecha_registro DESC'
    );
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}