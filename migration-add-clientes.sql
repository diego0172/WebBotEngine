-- Tabla para almacenar la información de clientes mostrados en la página principal
CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  url VARCHAR(500) NOT NULL,
  imagen_url VARCHAR(500) NOT NULL,
  orden INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP DEFAULT NOW()
);

-- Índice para mejorar el rendimiento de las consultas ordenadas
CREATE INDEX idx_clientes_orden ON clientes(orden, activo);

-- Insertar algunos datos de ejemplo
INSERT INTO clientes (nombre, descripcion, url, imagen_url, orden, activo) VALUES
('Restaurante', 'Sitio web moderno con menú digital y reservaciones', 'https://example.com/restaurante', 'img/cliente-restaurante.svg', 1, true),
('Tienda de Ropa', 'E-commerce completo con carrito de compras y pagos', 'https://example.com/tienda', 'img/cliente-tienda.svg', 2, true),
('Servicios Profesionales', 'Landing page para consultoría con formulario de contacto', 'https://example.com/consultoria', 'img/cliente-servicios.svg', 3, true),
('Clínica Médica', 'Sitio informativo con sistema de citas en línea', 'https://example.com/clinica', 'img/cliente-medico.svg', 4, true)
ON CONFLICT DO NOTHING;

-- Función para actualizar automáticamente fecha_actualizacion
CREATE OR REPLACE FUNCTION actualizar_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fecha_actualizacion = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar fecha_actualizacion en cada UPDATE
DROP TRIGGER IF EXISTS trigger_actualizar_clientes ON clientes;
CREATE TRIGGER trigger_actualizar_clientes
  BEFORE UPDATE ON clientes
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_fecha_actualizacion();
