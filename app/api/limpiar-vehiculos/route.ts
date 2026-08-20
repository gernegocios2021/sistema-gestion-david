import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    // Desactivar constraints temporalmente
    await executeQuery('SET session_replication_role = replica');
    
    // Eliminar en orden
    await executeQuery('DELETE FROM compras_vehiculos');
    await executeQuery('DELETE FROM toma_de_usado');
    await executeQuery('DELETE FROM vehiculos');
    
    // Reactivar constraints
    await executeQuery('SET session_replication_role = default');
    
    return NextResponse.json({ success: true, message: 'Base de datos limpiada' });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}