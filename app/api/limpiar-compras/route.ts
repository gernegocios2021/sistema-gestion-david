import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    await executeQuery('DELETE FROM compras_vehiculos');
    return NextResponse.json({ success: true, message: 'Compras eliminadas' });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}