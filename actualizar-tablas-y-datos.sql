-- Actualizar tablas existentes y agregar datos
BEGIN;

-- Agregar columnas faltantes a la tabla clientes (si no existen)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='clientes' AND column_name='industria') THEN
    ALTER TABLE clientes ADD COLUMN industria VARCHAR(100);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='clientes' AND column_name='fecha_lanzamiento') THEN
    ALTER TABLE clientes ADD COLUMN fecha_lanzamiento DATE;
  END IF;
END $$;

-- Agregar columnas faltantes a la tabla proyectos_demo (si no existen)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='proyectos_demo' AND column_name='tecnologias') THEN
    ALTER TABLE proyectos_demo ADD COLUMN tecnologias TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='proyectos_demo' AND column_name='categoria') THEN
    ALTER TABLE proyectos_demo ADD COLUMN categoria VARCHAR(100);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='proyectos_demo' AND column_name='destacado') THEN
    ALTER TABLE proyectos_demo ADD COLUMN destacado BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Agregar columnas faltantes a la tabla testimonios (si no existen)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='testimonios' AND column_name='empresa') THEN
    ALTER TABLE testimonios ADD COLUMN empresa VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='testimonios' AND column_name='cargo') THEN
    ALTER TABLE testimonios ADD COLUMN cargo VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='testimonios' AND column_name='calificacion') THEN
    ALTER TABLE testimonios ADD COLUMN calificacion INTEGER DEFAULT 5;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='testimonios' AND column_name='foto_url') THEN
    ALTER TABLE testimonios ADD COLUMN foto_url VARCHAR(500);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='testimonios' AND column_name='proyecto_relacionado') THEN
    ALTER TABLE testimonios ADD COLUMN proyecto_relacionado VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='testimonios' AND column_name='verificado') THEN
    ALTER TABLE testimonios ADD COLUMN verificado BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='testimonios' AND column_name='destacado') THEN
    ALTER TABLE testimonios ADD COLUMN destacado BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='testimonios' AND column_name='fecha_testimonio') THEN
    ALTER TABLE testimonios ADD COLUMN fecha_testimonio DATE DEFAULT CURRENT_DATE;
  END IF;
END $$;

-- Agregar constraint de calificación si no existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'testimonios_calificacion_check') THEN
    ALTER TABLE testimonios ADD CONSTRAINT testimonios_calificacion_check 
    CHECK (calificacion >= 1 AND calificacion <= 5);
  END IF;
END $$;

-- Insertar clientes de ejemplo (solo si no existen)
INSERT INTO clientes (nombre, descripcion, url, imagen_url, industria)
SELECT * FROM (VALUES 
  ('Restaurante La Esquina', 'Sitio web con menú digital y sistema de reservas', 'https://ejemplo.com/restaurante', 'img/robot.png', 'Gastronomía'),
  ('Boutique Fashion', 'E-commerce de moda con catálogo interactivo', 'https://ejemplo.com/boutique', 'img/robot.png', 'Moda'),
  ('Clínica Dental Sonrisa', 'Portal de citas médicas y servicios', 'https://ejemplo.com/clinica', 'img/robot.png', 'Salud'),
  ('Gym Fitness Pro', 'Plataforma de membresías y clases online', 'https://ejemplo.com/gym', 'img/robot.png', 'Deportes')
) AS v(nombre, descripcion, url, imagen_url, industria)
WHERE NOT EXISTS (SELECT 1 FROM clientes WHERE clientes.nombre = v.nombre);

-- Insertar proyectos demo (solo si no existen)
INSERT INTO proyectos_demo (titulo, descripcion, url_demo, imagen_preview, tecnologias, categoria, destacado)
SELECT * FROM (VALUES 
  ('Chatbot de Restaurante', 'Bot para tomar pedidos y reservas 24/7', 'https://ejemplo.com/demo1', 'img/robot.png', ARRAY['WhatsApp', 'AI', 'NLP'], 'Gastronomía', true),
  ('E-commerce Inteligente', 'Tienda online con recomendaciones AI', 'https://ejemplo.com/demo2', 'img/robot.png', ARRAY['React', 'Node.js', 'PostgreSQL'], 'Comercio', true),
  ('Sistema de Citas Médicas', 'Gestión automatizada de citas', 'https://ejemplo.com/demo3', 'img/robot.png', ARRAY['Vue.js', 'Express', 'Calendar API'], 'Salud', false),
  ('Portal de Servicios', 'Landing page con formulario inteligente', 'https://ejemplo.com/demo4', 'img/robot.png', ARRAY['HTML5', 'CSS3', 'JavaScript'], 'Servicios', false)
) AS v(titulo, descripcion, url_demo, imagen_preview, tecnologias, categoria, destacado)
WHERE NOT EXISTS (SELECT 1 FROM proyectos_demo WHERE proyectos_demo.titulo = v.titulo);

-- Insertar testimonios (solo si no existen)
INSERT INTO testimonios (nombre_cliente, empresa, cargo, testimonio, calificacion, verificado, destacado, fecha_testimonio)
SELECT * FROM (VALUES 
  ('María González', 'Restaurante La Esquina', 'Gerente General', 'El chatbot ha revolucionado nuestro servicio. Ahora podemos atender pedidos las 24 horas y nuestras reservas aumentaron 40%. ¡Increíble trabajo!', 5, true, true, '2025-12-15'::date),
  ('Carlos Méndez', 'Tech Solutions GT', 'CEO', 'Profesionales excepcionales. Nuestro sitio web es rápido, moderno y ha mejorado significativamente nuestra presencia digital. Totalmente recomendados.', 5, true, true, '2025-11-20'::date),
  ('Ana Rodríguez', 'Boutique Fashion', 'Propietaria', 'La tienda online superó nuestras expectativas. El diseño es hermoso y las ventas online han crecido 60% en solo 2 meses.', 5, true, true, '2025-12-01'::date),
  ('Roberto Pérez', 'Clínica Dental Sonrisa', 'Director', 'El sistema de citas automatizado nos ahorró tiempo y mejoró la experiencia de nuestros pacientes. Excelente inversión.', 5, true, false, '2025-10-10'::date),
  ('Laura Castillo', 'Gym Fitness Pro', 'Gerente de Marketing', 'El sitio web y el bot de WhatsApp funcionan perfectamente. Hemos digitalizado todo el proceso de membresías.', 4, true, false, '2025-11-05'::date),
  ('Jorge Ramírez', 'Comercial Express', 'Gerente de Operaciones', 'Servicio rápido y eficiente. El equipo entendió perfectamente nuestras necesidades y entregó a tiempo.', 5, true, false, '2025-09-25'::date)
) AS v(nombre_cliente, empresa, cargo, testimonio, calificacion, verificado, destacado, fecha_testimonio)
WHERE NOT EXISTS (SELECT 1 FROM testimonios WHERE testimonios.nombre_cliente = v.nombre_cliente);

-- Verificar datos insertados
SELECT 'Clientes:' as tabla, COUNT(*) as total FROM clientes
UNION ALL
SELECT 'Proyectos Demo:' as tabla, COUNT(*) as total FROM proyectos_demo
UNION ALL
SELECT 'Testimonios:' as tabla, COUNT(*) as total FROM testimonios;

COMMIT;

SELECT '✅ Base de datos actualizada correctamente' as resultado;
