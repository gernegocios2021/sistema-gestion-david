import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    await executeQuery(`
      ALTER TABLE vehiculos ADD COLUMN IF NOT EXISTS version VARCHAR(100);
      ALTER TABLE vehiculos ADD COLUMN IF NOT EXISTS combustible VARCHAR(50);
      ALTER TABLE vehiculos ADD COLUMN IF NOT EXISTS primera_mano BOOLEAN DEFAULT false;
      ALTER TABLE vehiculos ADD COLUMN IF NOT EXISTS observaciones TEXT;
    `);

    return NextResponse.json({ 
      success: true, 
      message: 'Campos agregados a vehiculos' 
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}