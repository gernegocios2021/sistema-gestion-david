import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

function detectarSeccion(texto: string) {
  const txt = texto.toUpperCase();
  if (txt.includes('CARLOS PAZ') || txt.includes('LOCAL')) {
    return { ubicacion: 'Local Carlos Paz', tipo_vehiculo: 'auto', estado: 'disponible' };
  }
  if (txt.includes('MOTOS')) {
    return { ubicacion: 'Oficina Cerro', tipo_vehiculo: 'moto', estado: 'disponible' };
  }
  if (txt.includes('NUEVOS INGRESOS')) {
    return { ubicacion: 'Oficina Cerro', tipo_vehiculo: 'auto', estado: 'nuevo ingreso' };
  }
  return { ubicacion: 'Oficina Cerro', tipo_vehiculo: 'auto', estado: 'disponible' };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { datos, ubicacion, tipo_vehiculo, estado_ingreso } = body;

    const resultados: any[] = [];
    let errores = 0;

    for (const auto of datos) {
      try {
        const patente = (auto['DOMINIO.-'] || auto['DOMINIO'] || '').toString().trim().toUpperCase();
        const marca = (auto['MARCA.-'] || auto['MARCA'] || '').toString().trim();
        const modelo = (auto['MODELO.-'] || auto['MODELO'] || '').toString().trim();
        const ano = parseInt(auto['AÑO.-'] || auto['AÑO'] || 0) || new Date().getFullYear();
        const km = parseInt(auto['KILOMETROS.-'] || auto['KILOMETROS'] || '0') || 0;
        const color = (auto['COLOR.-'] || auto['COLOR'] || '').toString().trim();

        let precioStr = (auto['VALOR DE VENTA.-'] || auto['VALOR DE VENTA'] || '').toString().trim();
        precioStr = precioStr.replace(/[$USD\s.-]/g, '').replace(/,/g, '.');
        const precio_venta = parseFloat(precioStr) || 0;

        if (!patente || patente.length < 2 || !marca || !modelo || precio_venta === 0) {
          errores++;
          continue;
        }

        // Crear vehículo
        const vehiculoRes = await executeQuery(
          `INSERT INTO vehiculos (patente, marca, modelo, ano, kilometros, combustible, version, observaciones, ubicacion, tipo_vehiculo, estado_ingreso)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (patente) DO UPDATE SET modelo=EXCLUDED.modelo, ano=EXCLUDED.ano, ubicacion=EXCLUDED.ubicacion, tipo_vehiculo=EXCLUDED.tipo_vehiculo
           RETURNING id`,
          [patente, marca, modelo, ano, km, '', color, '', ubicacion || 'Oficina Cerro', tipo_vehiculo || 'auto', estado_ingreso || 'disponible']
        );

        const vehiculo_id = vehiculoRes.rows[0].id;

        const precio_compra = precio_venta / 1.25;
        const gastos = 0;
        const monto_comision = (precio_venta * 3) / 100;

        await executeQuery(
          `INSERT INTO compras_vehiculos (vehiculo_id, precio_compra, gastos_taller, precio_venta_calculado, margen_porcentaje, fecha_compra, comision_vendedor, monto_comision)
           VALUES ($1, $2, $3, $4, $5, NOW(), 3, $6)
           ON CONFLICT DO NOTHING
           RETURNING *`,
          [vehiculo_id, precio_compra, gastos, precio_venta, 25, monto_comision]
        );

        resultados.push({
          patente,
          marca,
          modelo,
          ubicacion: ubicacion || 'Oficina Cerro',
          tipo: tipo_vehiculo || 'auto',
          status: 'ok'
        });
      } catch (err) {
        console.error('Error procesando auto:', err);
        errores++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      importados: resultados.length,
      errores,
      resultados 
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}