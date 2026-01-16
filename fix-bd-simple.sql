-- PASO 1: Cerrar cualquier transacción abierta
ROLLBACK;

-- PASO 2: Agregar columnas que faltan (ejecuta esto COMPLETO)

-- Columnas para clientes
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS industria VARCHAR(100);
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS fecha_lanzamiento DATE;

-- Columnas para proyectos_demo
ALTER TABLE proyectos_demo ADD COLUMN IF NOT EXISTS tecnologias TEXT[];
ALTER TABLE proyectos_demo ADD COLUMN IF NOT EXISTS categoria VARCHAR(100);
ALTER TABLE proyectos_demo ADD COLUMN IF NOT EXISTS destacado BOOLEAN DEFAULT false;

-- Columnas para testimonios
ALTER TABLE testimonios ADD COLUMN IF NOT EXISTS empresa VARCHAR(255);
ALTER TABLE testimonios ADD COLUMN IF NOT EXISTS cargo VARCHAR(255);
ALTER TABLE testimonios ADD COLUMN IF NOT EXISTS calificacion INTEGER DEFAULT 5;
ALTER TABLE testimonios ADD COLUMN IF NOT EXISTS foto_url VARCHAR(500);
ALTER TABLE testimonios ADD COLUMN IF NOT EXISTS proyecto_relacionado VARCHAR(255);
ALTER TABLE testimonios ADD COLUMN IF NOT EXISTS verificado BOOLEAN DEFAULT false;
ALTER TABLE testimonios ADD COLUMN IF NOT EXISTS destacado BOOLEAN DEFAULT false;
ALTER TABLE testimonios ADD COLUMN IF NOT EXISTS fecha_testimonio DATE DEFAULT CURRENT_DATE;

-- PASO 3: Insertar datos de ejemplo

-- Clientes
INSERT INTO clientes (nombre, descripcion, url, imagen_url, industria)
VALUES 
  ('Restaurante La Esquina', 'Sitio web con menú digital y sistema de reservas', 'https://ejemplo.com/restaurante', 'img/robot.png', 'Gastronomía'),
  ('Boutique Fashion', 'E-commerce de moda con catálogo interactivo', 'https://ejemplo.com/boutique', 'img/robot.png', 'Moda'),
  ('Clínica Dental Sonrisa', 'Portal de citas médicas y servicios', 'https://ejemplo.com/clinica', 'img/robot.png', 'Salud'),
  ('Gym Fitness Pro', 'Plataforma de membresías y clases online', 'https://ejemplo.com/gym', 'img/robot.png', 'Deportes')
ON CONFLICT (id) DO NOTHING;

-- Proyectos demo
INSERT INTO proyectos_demo (titulo, descripcion, url_demo, imagen_preview, tecnologias, categoria, destacado)
VALUES 
  ('Chatbot de Restaurante', 'Bot para tomar pedidos y reservas 24/7', 'https://ejemplo.com/demo1', 'img/robot.png', ARRAY['WhatsApp', 'AI', 'NLP'], 'Gastronomía', true),
  ('E-commerce Inteligente', 'Tienda online con recomendaciones AI', 'https://ejemplo.com/demo2', 'img/robot.png', ARRAY['React', 'Node.js', 'PostgreSQL'], 'Comercio', true),
  ('Sistema de Citas Médicas', 'Gestión automatizada de citas', 'https://ejemplo.com/demo3', 'img/robot.png', ARRAY['Vue.js', 'Express', 'Calendar API'], 'Salud', false),
  ('Portal de Servicios', 'Landing page con formulario inteligente', 'https://ejemplo.com/demo4', 'img/robot.png', ARRAY['HTML5', 'CSS3', 'JavaScript'], 'Servicios', false)
ON CONFLICT (id) DO NOTHING;

-- Testimonios
INSERT INTO testimonios (nombre_cliente, empresa, cargo, testimonio, calificacion, verificado, destacado, fecha_testimonio)
VALUES 
  ('María González', 'Restaurante La Esquina', 'Gerente General', 'El chatbot ha revolucionado nuestro servicio. Ahora podemos atender pedidos las 24 horas y nuestras reservas aumentaron 40%. ¡Increíble trabajo!', 5, true, true, '2025-12-15'),
  ('Carlos Méndez', 'Tech Solutions GT', 'CEO', 'Profesionales excepcionales. Nuestro sitio web es rápido, moderno y ha mejorado significativamente nuestra presencia digital. Totalmente recomendados.', 5, true, true, '2025-11-20'),
  ('Ana Rodríguez', 'Boutique Fashion', 'Propietaria', 'La tienda online superó nuestras expectativas. El diseño es hermoso y las ventas online han crecido 60% en solo 2 meses.', 5, true, true, '2025-12-01'),
  ('Roberto Pérez', 'Clínica Dental Sonrisa', 'Director', 'El sistema de citas automatizado nos ahorró tiempo y mejoró la experiencia de nuestros pacientes. Excelente inversión.', 5, true, false, '2025-10-10'),
  ('Laura Castillo', 'Gym Fitness Pro', 'Gerente de Marketing', 'El sitio web y el bot de WhatsApp funcionan perfectamente. Hemos digitalizado todo el proceso de membresías.', 4, true, false, '2025-11-05'),
  ('Jorge Ramírez', 'Comercial Express', 'Gerente de Operaciones', 'Servicio rápido y eficiente. El equipo entendió perfectamente nuestras necesidades y entregó a tiempo.', 5, true, false, '2025-09-25')
ON CONFLICT (id) DO NOTHING;

-- PASO 4: Verificar
SELECT 'Clientes' as tabla, COUNT(*) as total FROM clientes
UNION ALL
SELECT 'Demos', COUNT(*) FROM proyectos_demo
UNION ALL
SELECT 'Testimonios', COUNT(*) FROM testimonios;
