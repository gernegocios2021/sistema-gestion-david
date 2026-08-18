-- ============================================
-- SCHEMA: GESTIONPRO - CONCESIONARIO DAVID
-- ============================================

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(100),
  rol VARCHAR(50) DEFAULT 'vendedor',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Vehículos (Inventario)
CREATE TABLE IF NOT EXISTS vehiculos (
  id SERIAL PRIMARY KEY,
  patente VARCHAR(10) UNIQUE NOT NULL,
  vin VARCHAR(17),
  marca VARCHAR(50),
  modelo VARCHAR(100),
  ano INTEGER,
  kilometros INTEGER,
  precio_base NUMERIC(12,2),
  precio_venta NUMERIC(12,2),
  estado VARCHAR(50) DEFAULT 'disponible',
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Proveedores
CREATE TABLE IF NOT EXISTS proveedores (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  telefono VARCHAR(20),
  documento VARCHAR(20),
  direccion TEXT,
  ciudad VARCHAR(50),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100),
  email VARCHAR(255),
  telefono VARCHAR(20),
  documento VARCHAR(20),
  direccion TEXT,
  ciudad VARCHAR(50),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Compras de Vehículos
CREATE TABLE IF NOT EXISTS compras_vehiculos (
  id SERIAL PRIMARY KEY,
  vehiculo_id INTEGER REFERENCES vehiculos(id),
  proveedor_id INTEGER REFERENCES proveedores(id),
  precio_compra NUMERIC(12,2) NOT NULL,
  gastos_asociados NUMERIC(12,2) DEFAULT 0,
  fecha_compra DATE NOT NULL,
  descripcion TEXT,
  estado VARCHAR(50) DEFAULT 'completada',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Ventas de Vehículos
CREATE TABLE IF NOT EXISTS ventas_vehiculos (
  id SERIAL PRIMARY KEY,
  vehiculo_id INTEGER REFERENCES vehiculos(id),
  cliente_id INTEGER REFERENCES clientes(id),
  usuario_id INTEGER REFERENCES usuarios(id),
  precio_venta NUMERIC(12,2) NOT NULL,
  forma_pago VARCHAR(50),
  comision_vendedor NUMERIC(12,2),
  utilidad NUMERIC(12,2),
  margen_porcentaje NUMERIC(5,2),
  fecha_venta DATE NOT NULL,
  descripcion TEXT,
  estado VARCHAR(50) DEFAULT 'completada',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Empleados/Vendedores
CREATE TABLE IF NOT EXISTS empleados (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  telefono VARCHAR(20),
  rol VARCHAR(50),
  comision_porcentaje NUMERIC(5,2) DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Historial de Transacciones
CREATE TABLE IF NOT EXISTS transacciones (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(50),
  vehiculo_id INTEGER REFERENCES vehiculos(id),
  monto NUMERIC(12,2),
  fecha TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_vehiculos_patente ON vehiculos(patente);
CREATE INDEX idx_vehiculos_estado ON vehiculos(estado);
CREATE INDEX idx_ventas_fecha ON ventas_vehiculos(fecha_venta);
CREATE INDEX idx_ventas_cliente ON ventas_vehiculos(cliente_id);
CREATE INDEX idx_compras_fecha ON compras_vehiculos(fecha_compra);
CREATE INDEX idx_usuarios_email ON usuarios(email);