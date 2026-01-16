-- Arreglar TODAS las URLs rotas de ejemplo.com
-- Este script actualiza tanto clientes como demos

-- ========================================
-- CLIENTES - Actualizar URLs del portafolio
-- ========================================

-- Restaurante La Esquina → demo-generator
UPDATE clientes SET 
  url = 'demo-generator.html'
WHERE nombre = 'Restaurante La Esquina';

-- Boutique Fashion → tienda (e-commerce)
UPDATE clientes SET 
  url = 'tienda.html'
WHERE nombre = 'Boutique Fashion';

-- Clínica Dental Sonrisa → demo-generator
UPDATE clientes SET 
  url = 'demo-generator.html'
WHERE nombre = 'Clínica Dental Sonrisa';

-- Gym Fitness Pro → demo-gym
UPDATE clientes SET 
  url = 'demo-gym.html'
WHERE nombre = 'Gym Fitness Pro';

-- ========================================
-- PROYECTOS DEMO - Limpiar duplicados
-- ========================================

-- Eliminar demos con URLs rotas (#demo-xxx)
DELETE FROM proyectos_demo WHERE url LIKE '#demo-%';

-- Eliminar demos con https://ejemplo.com
DELETE FROM proyectos_demo WHERE url LIKE 'https://ejemplo.com%';

-- ========================================
-- PROYECTOS DEMO - Configurar correctamente
-- ========================================

-- Asegurarse de que solo queden estos 4 demos con URLs correctas
-- Si existen, actualizar. Si no, insertar.

-- Demo 1: Gym Fitness Pro
INSERT INTO proyectos_demo (nombre, descripcion, url, imagen_url, tecnologias, categoria, destacado, activo, orden)
VALUES 
  ('Gym Fitness Pro', 
   'Sitio web completo para gimnasio con planes de membresía, clases grupales y entrenamiento personalizado',
   'demo-gym.html',
   'img/demo-gimnasio.svg',
   'HTML5, CSS3, JavaScript, Responsive',
   'Deportes',
   true,
   true,
   1)
ON CONFLICT (nombre) DO UPDATE SET
  url = 'demo-gym.html',
  destacado = true,
  orden = 1;

-- Demo 2: Chatbot Restaurante  
INSERT INTO proyectos_demo (nombre, descripcion, url, imagen_url, tecnologias, categoria, destacado, activo, orden)
VALUES 
  ('Chatbot Restaurante',
   'Chatbot inteligente para tomar pedidos, reservas y consultas 24/7',
   'demo-generator.html',
   'img/demo-restaurante-gourmet.svg',
   'JavaScript, AI, NLP',
   'Gastronomía',
   true,
   true,
   2)
ON CONFLICT (nombre) DO UPDATE SET
  url = 'demo-generator.html',
  destacado = true,
  orden = 2;

-- Demo 3: Tienda Online
INSERT INTO proyectos_demo (nombre, descripcion, url, imagen_url, tecnologias, categoria, destacado, activo, orden)
VALUES 
  ('Tienda Online',
   'E-commerce con carrito de compras y sistema de pagos integrado',
   'tienda.html',
   'img/robot.png',
   'React, Node.js, PostgreSQL',
   'Comercio',
   false,
   true,
   3)
ON CONFLICT (nombre) DO UPDATE SET
  url = 'tienda.html',
  destacado = false,
  orden = 3;

-- Demo 4: Clínica Dental
INSERT INTO proyectos_demo (nombre, descripcion, url, imagen_url, tecnologias, categoria, destacado, activo, orden)
VALUES 
  ('Clínica Dental',
   'Sistema de gestión de citas médicas con recordatorios automáticos',
   'demo-generator.html',
   'img/demo-dental.svg',
   'Vue.js, Express, Calendar API',
   'Salud',
   false,
   true,
   4)
ON CONFLICT (nombre) DO UPDATE SET
  url = 'demo-generator.html',
  destacado = false,
  orden = 4;

-- ========================================
-- VERIFICACIÓN FINAL
-- ========================================

-- Ver clientes actualizados
SELECT 'CLIENTES' as tabla, id, nombre, url FROM clientes ORDER BY id;

-- Ver demos actualizados
SELECT 'DEMOS' as tabla, id, nombre, url, destacado, orden FROM proyectos_demo ORDER BY orden;
