-- Crear tablas para desarrollo local
-- Ejecutar con: psql -U postgres -d tu_base_de_datos -f crear-tablas-locales.sql

BEGIN;

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  url VARCHAR(500),
  imagen_url VARCHAR(500),
  industria VARCHAR(100),
  fecha_lanzamiento DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de proyectos demo
CREATE TABLE IF NOT EXISTS proyectos_demo (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  url_demo VARCHAR(500),
  imagen_preview VARCHAR(500),
  tecnologias TEXT[],
  categoria VARCHAR(100),
  destacado BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de testimonios
CREATE TABLE IF NOT EXISTS testimonios (
  id SERIAL PRIMARY KEY,
  nombre_cliente VARCHAR(255) NOT NULL,
  empresa VARCHAR(255),
  cargo VARCHAR(255),
  testimonio TEXT NOT NULL,
  calificacion INTEGER CHECK (calificacion >= 1 AND calificacion <= 5) DEFAULT 5,
  foto_url VARCHAR(500),
  proyecto_relacionado VARCHAR(255),
  verificado BOOLEAN DEFAULT false,
  destacado BOOLEAN DEFAULT false,
  fecha_testimonio DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar clientes de ejemplo
INSERT INTO clientes (nombre, descripcion, url, imagen_url, industria)
VALUES 
  ('Restaurante La Esquina', 'Sitio web con menú digital y sistema de reservas', 'https://ejemplo.com/restaurante', 'img/robot.png', 'Gastronomía'),
  ('Boutique Fashion', 'E-commerce de moda con catálogo interactivo', 'https://ejemplo.com/boutique', 'img/robot.png', 'Moda'),
  ('Clínica Dental Sonrisa', 'Portal de citas médicas y servicios', 'https://ejemplo.com/clinica', 'img/robot.png', 'Salud'),
  ('Gym Fitness Pro', 'Plataforma de membresías y clases online', 'https://ejemplo.com/gym', 'img/robot.png', 'Deportes')
ON CONFLICT DO NOTHING;

-- Insertar proyectos demo
INSERT INTO proyectos_demo (titulo, descripcion, url_demo, imagen_preview, tecnologias, categoria, destacado)
VALUES 
  ('Chatbot de Restaurante', 'Bot para tomar pedidos y reservas 24/7', 'https://ejemplo.com/demo1', 'img/robot.png', ARRAY['WhatsApp', 'AI', 'NLP'], 'Gastronomía', true),
  ('E-commerce Inteligente', 'Tienda online con recomendaciones AI', 'https://ejemplo.com/demo2', 'img/robot.png', ARRAY['React', 'Node.js', 'PostgreSQL'], 'Comercio', true),
  ('Sistema de Citas Médicas', 'Gestión automatizada de citas', 'https://ejemplo.com/demo3', 'img/robot.png', ARRAY['Vue.js', 'Express', 'Calendar API'], 'Salud', false),
  ('Portal de Servicios', 'Landing page con formulario inteligente', 'https://ejemplo.com/demo4', 'img/robot.png', ARRAY['HTML5', 'CSS3', 'JavaScript'], 'Servicios', false)
ON CONFLICT DO NOTHING;

-- Insertar testimonios
INSERT INTO testimonios (nombre_cliente, empresa, cargo, testimonio, calificacion, verificado, destacado, fecha_testimonio)
VALUES 
  ('María González', 'Restaurante La Esquina', 'Gerente General', 'El chatbot ha revolucionado nuestro servicio. Ahora podemos atender pedidos las 24 horas y nuestras reservas aumentaron 40%. ¡Increíble trabajo!', 5, true, true, '2025-12-15'),
  ('Carlos Méndez', 'Tech Solutions GT', 'CEO', 'Profesionales excepcionales. Nuestro sitio web es rápido, moderno y ha mejorado significativamente nuestra presencia digital. Totalmente recomendados.', 5, true, true, '2025-11-20'),
  ('Ana Rodríguez', 'Boutique Fashion', 'Propietaria', 'La tienda online superó nuestras expectativas. El diseño es hermoso y las ventas online han crecido 60% en solo 2 meses.', 5, true, true, '2025-12-01'),
  ('Roberto Pérez', 'Clínica Dental Sonrisa', 'Director', 'El sistema de citas automatizado nos ahorró tiempo y mejoró la experiencia de nuestros pacientes. Excelente inversión.', 5, true, false, '2025-10-10'),
  ('Laura Castillo', 'Gym Fitness Pro', 'Gerente de Marketing', 'El sitio web y el bot de WhatsApp funcionan perfectamente. Hemos digitalizado todo el proceso de membresías.', 4, true, false, '2025-11-05'),
  ('Jorge Ramírez', 'Comercial Express', 'Gerente de Operaciones', 'Servicio rápido y eficiente. El equipo entendió perfectamente nuestras necesidades y entregó a tiempo.', 5, true, false, '2025-09-25')
ON CONFLICT DO NOTHING;

-- Verificar datos insertados
SELECT 'Clientes insertados:' as mensaje, COUNT(*) as total FROM clientes;
SELECT 'Proyectos Demo insertados:' as mensaje, COUNT(*) as total FROM proyectos_demo;
SELECT 'Testimonios insertados:' as mensaje, COUNT(*) as total FROM testimonios;

COMMIT;

VACUUM ANALYZE clientes;
VACUUM ANALYZE proyectos_demo;
VACUUM ANALYZE testimonios;

SELECT 'Base de datos lista ✅' as estado;
