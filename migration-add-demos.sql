-- Tabla para almacenar proyectos demo/ejemplos
CREATE TABLE IF NOT EXISTS proyectos_demo (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  url VARCHAR(500) NOT NULL,
  imagen_url VARCHAR(500) NOT NULL,
  categoria VARCHAR(100) NOT NULL, -- ej: Peluquería, Restaurante, Tienda, Servicios
  tecnologias TEXT, -- Tecnologías usadas (opcional)
  destacado BOOLEAN DEFAULT false, -- Marcar como destacado en la galería
  orden INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP DEFAULT NOW()
);

-- Índice para mejorar el rendimiento
CREATE INDEX idx_demos_categoria ON proyectos_demo(categoria, activo);
CREATE INDEX idx_demos_destacado ON proyectos_demo(destacado, activo);

-- Insertar datos de ejemplo
INSERT INTO proyectos_demo (nombre, descripcion, url, imagen_url, categoria, tecnologias, destacado, orden, activo) VALUES
('Peluquería Estilo Moderno', 'Sistema completo de reservas en línea, galería de estilos y gestión de citas para salón de belleza', '#demo-peluqueria', 'img/demo-peluqueria.svg', 'Peluquería', 'HTML5, CSS3, JavaScript, Sistema de Reservas', true, 1, true),
('Restaurante Gourmet', 'Menú digital interactivo, sistema de pedidos en línea y reservaciones de mesas', '#demo-restaurante', 'img/demo-restaurante-gourmet.svg', 'Restaurante', 'React, Node.js, Sistema de Pagos', true, 2, true),
('Gimnasio Fitness Pro', 'Plataforma de membresías, clases virtuales y seguimiento de progreso', '#demo-gimnasio', 'img/demo-gimnasio.svg', 'Deportes', 'Vue.js, Firebase, Streaming', false, 3, true),
('Consultorio Dental', 'Agenda de citas médicas, historial de pacientes y recordatorios automáticos', '#demo-dental', 'img/demo-dental.svg', 'Salud', 'Angular, PostgreSQL, WhatsApp API', false, 4, true)
ON CONFLICT DO NOTHING;

-- Usar el trigger existente para actualización de fechas
DROP TRIGGER IF EXISTS trigger_actualizar_demos ON proyectos_demo;
CREATE TRIGGER trigger_actualizar_demos
  BEFORE UPDATE ON proyectos_demo
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_fecha_actualizacion();
