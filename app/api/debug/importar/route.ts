import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const allData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

    // Analizar estructura
    const secciones: any[] = [];
    let currentSeccion = null;
    let autoCount = 0, motoCount = 0, nuevosCount = 0, carlospazCount = 0;

    for (let i = 0; i < allData.length; i++) {
      const row = allData[i];
      const firstCell = String(row[0] || '').toUpperCase().trim();

      if (firstCell.includes('CARLOS PAZ') || firstCell.includes('LOCAL')) {
        currentSeccion = 'LOCAL_CARLOS_PAZ';
        carlospazCount = 0;
      } else if (firstCell.includes('MOTOS')) {
        currentSeccion = 'MOTOS';
        motoCount = 0;
      } else if (firstCell.includes('NUEVOS INGRESOS')) {
        currentSeccion = 'NUEVOS_INGRESOS';
        nuevosCount = 0;
      } else if (firstCell.includes('AUTOS')) {
        currentSeccion = 'AUTOS';
        autoCount = 0;
      }

      // Contar si es una fila de vehículo
      const patente = String(row[4] || '').trim();
      const precio = String(row[7] || '').trim();

      if (patente && patente.length > 2 && precio && precio !== '-') {
        if (currentSeccion === 'AUTOS') autoCount++;
        else if (currentSeccion === 'MOTOS') motoCount++;
        else if (currentSeccion === 'NUEVOS_INGRESOS') nuevosCount++;
        else if (currentSeccion === 'LOCAL_CARLOS_PAZ') carlospazCount++;
      }
    }

    return NextResponse.json({
      secciones: {
        autos: autoCount,
        motos: motoCount,
        nuevos_ingresos: nuevosCount,
        local_carlos_paz: carlospazCount,
        total: autoCount + motoCount + nuevosCount + carlospazCount
      }
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}