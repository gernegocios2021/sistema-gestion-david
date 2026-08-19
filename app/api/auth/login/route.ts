import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y password requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario
    const result = await executeQuery(
      'SELECT id, password_hash, nombre, rol FROM usuarios WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Verificar password
    if (password !== user.password_hash) {
      return NextResponse.json(
        { error: 'Password incorrecto' },
        { status: 401 }
      );
    }

    // Generar token simple (sin jwt por ahora)
    const token = Buffer.from(JSON.stringify({ id: user.id, email })).toString('base64');

    return NextResponse.json({
      success: true,
      token,
      user: { id: user.id, email, nombre: user.nombre, rol: user.rol }
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}