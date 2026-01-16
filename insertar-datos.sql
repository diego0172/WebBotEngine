-- Insertar datos con las columnas correctas

-- Clientes (usa las columnas que realmente existen)
INSERT INTO clientes (nombre, descripcion, url, imagen_url, activo)
VALUES 
  ('Restaurante La Esquina', 'Sitio web con menú digital y sistema de reservas', 'https://ejemplo.com/restaurante', 'img/robot.png', true),
  ('Boutique Fashion', 'E-commerce de moda con catálogo interactivo', 'https://ejemplo.com/boutique', 'img/robot.png', true),
  ('Clínica Dental Sonrisa', 'Portal de citas médicas y servicios', 'https://ejemplo.com/clinica', 'img/robot.png', true),
  ('Gym Fitness Pro', 'Plataforma de membresías y clases online', 'https://ejemplo.com/gym', 'img/robot.png', true)
ON CONFLICT (id) DO NOTHING;

-- Proyectos demo (nombre NO titulo, tecnologias es TEXT no ARRAY)
INSERT INTO proyectos_demo (nombre, descripcion, url, imagen_url, tecnologias, categoria, destacado, activo)
VALUES 
  ('Chatbot de Restaurante', 'Bot para tomar pedidos y reservas 24/7', 'https://ejemplo.com/demo1', 'img/robot.png', 'WhatsApp, AI, NLP', 'Gastronomía', true, true),
  ('E-commerce Inteligente', 'Tienda online con recomendaciones AI', 'https://ejemplo.com/demo2', 'img/robot.png', 'React, Node.js, PostgreSQL', 'Comercio', true, true),
  ('Sistema de Citas Médicas', 'Gestión automatizada de citas', 'https://ejemplo.com/demo3', 'img/robot.png', 'Vue.js, Express, Calendar API', 'Salud', false, true),
  ('Portal de Servicios', 'Landing page con formulario inteligente', 'https://ejemplo.com/demo4', 'img/robot.png', 'HTML5, CSS3, JavaScript', 'Servicios', false, true)
ON CONFLICT (id) DO NOTHING;

-- Testimonios
INSERT INTO testimonios (nombre_cliente, empresa, cargo, testimonio, calificacion, verificado, destacado, fecha_testimonio, activo)
VALUES 
  ('María González', 'Restaurante La Esquina', 'Gerente General', 'El chatbot ha revolucionado nuestro servicio. Ahora podemos atender pedidos las 24 horas y nuestras reservas aumentaron 40%. ¡Increíble trabajo!', 5, true, true, '2025-12-15', true),
  ('Carlos Méndez', 'Tech Solutions GT', 'CEO', 'Profesionales excepcionales. Nuestro sitio web es rápido, moderno y ha mejorado significativamente nuestra presencia digital. Totalmente recomendados.', 5, true, true, '2025-11-20', true),
  ('Ana Rodríguez', 'Boutique Fashion', 'Propietaria', 'La tienda online superó nuestras expectativas. El diseño es hermoso y las ventas online han crecido 60% en solo 2 meses.', 5, true, true, '2025-12-01', true),
  ('Roberto Pérez', 'Clínica Dental Sonrisa', 'Director', 'El sistema de citas automatizado nos ahorró tiempo y mejoró la experiencia de nuestros pacientes. Excelente inversión.', 5, true, false, '2025-10-10', true),
  ('Laura Castillo', 'Gym Fitness Pro', 'Gerente de Marketing', 'El sitio web y el bot de WhatsApp funcionan perfectamente. Hemos digitalizado todo el proceso de membresías.', 4, true, false, '2025-11-05', true),
  ('Jorge Ramírez', 'Comercial Express', 'Gerente de Operaciones', 'Servicio rápido y eficiente. El equipo entendió perfectamente nuestras necesidades y entregó a tiempo.', 5, true, false, '2025-09-25', true)
ON CONFLICT (id) DO NOTHING;

-- Verificar datos insertados
SELECT 'Clientes' as tabla, COUNT(*) as total FROM clientes WHERE activo = true
UNION ALL
SELECT 'Demos', COUNT(*) FROM proyectos_demo WHERE activo = true
UNION ALL
SELECT 'Testimonios', COUNT(*) FROM testimonios WHERE activo = true;
