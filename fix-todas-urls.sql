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

-- Primero actualizar los que ya existen
UPDATE proyectos_demo SET 
  descripcion = 'Sitio web completo para gimnasio con planes de membresía, clases grupales y entrenamiento personalizado',
  url = 'demo-gym.html',
  imagen_url = 'img/demo-gimnasio.svg',
  tecnologias = 'HTML5, CSS3, JavaScript, Responsive',
  categoria = 'Deportes',
  destacado = true,
  activo = true,
  orden = 1
WHERE nombre LIKE '%Gym%' OR nombre LIKE '%Gimnasio%';

UPDATE proyectos_demo SET 
  nombre = 'Chatbot Restaurante',
  descripcion = 'Chatbot inteligente para tomar pedidos, reservas y consultas 24/7',
  url = 'demo-generator.html',
  imagen_url = 'img/demo-restaurante-gourmet.svg',
  tecnologias = 'JavaScript, AI, NLP',
  categoria = 'Gastronomía',
  destacado = true,
  activo = true,
  orden = 2
WHERE nombre LIKE '%Chatbot%Restaurante%';

UPDATE proyectos_demo SET 
  nombre = 'Tienda Online',
  descripcion = 'E-commerce con carrito de compras y sistema de pagos integrado',
  url = 'tienda.html',
  imagen_url = 'img/robot.png',
  tecnologias = 'React, Node.js, PostgreSQL',
  categoria = 'Comercio',
  destacado = false,
  activo = true,
  orden = 3
WHERE nombre LIKE '%commerce%';

UPDATE proyectos_demo SET 
  nombre = 'Clínica Dental',
  descripcion = 'Sistema de gestión de citas médicas con recordatorios automáticos',
  url = 'demo-generator.html',
  imagen_url = 'img/demo-dental.svg',
  tecnologias = 'Vue.js, Express, Calendar API',
  categoria = 'Salud',
  destacado = false,
  activo = true,
  orden = 4
WHERE nombre LIKE '%Citas%' OR nombre LIKE '%Dental%';

-- ========================================
-- VERIFICACIÓN FINAL
-- ========================================

-- Ver clientes actualizados
SELECT 'CLIENTES' as tabla, id, nombre, url FROM clientes ORDER BY id;

-- Ver demos actualizados
SELECT 'DEMOS' as tabla, id, nombre, url, destacado, orden FROM proyectos_demo ORDER BY orden;
