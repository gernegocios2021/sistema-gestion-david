import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    const result = await executeQuery(
      'SELECT * FROM clientes ORDER BY created_at DESC'
    );
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nombre, apellido, email, telefono, documento } = await req.json();

    const result = await executeQuery(
      `INSERT INTO clientes (nombre, apellido, email, telefono, documento)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nombre, apellido, email, telefono, documento]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
