import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    await executeQuery(
      'ALTER TABLE clientes ADD COLUMN IF NOT EXISTS apellido VARCHAR(100)'
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Columna apellido agregada a tabla clientes' 
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}