-- Versión SIMPLE: Actualizar por ID directamente
-- Ejecuta estos comandos UNO POR UNO en el admin panel

-- Borrar demos con URLs rotas
DELETE FROM proyectos_demo WHERE id IN (1, 2, 4);

-- Actualizar Gimnasio (ID 3)
UPDATE proyectos_demo SET 
  nombre = 'Gym Fitness Pro',
  descripcion = 'Sitio web completo para gimnasio con planes de membresía, clases grupales y entrenamiento personalizado',
  url = 'demo-gym.html',
  imagen_url = 'img/demo-gimnasio.svg',
  categoria = 'Deportes',
  destacado = true,
  orden = 1
WHERE id = 3;

-- Actualizar Chatbot Restaurante (ID 5)
UPDATE proyectos_demo SET 
  nombre = 'Chatbot Restaurante',
  descripcion = 'Chatbot inteligente para tomar pedidos, reservas y consultas 24/7',
  url = 'demo-generator.html',
  imagen_url = 'img/demo-restaurante-gourmet.svg',
  categoria = 'Gastronomía',
  destacado = true,
  orden = 2
WHERE id = 5;

-- Actualizar E-commerce (ID 6)
UPDATE proyectos_demo SET 
  nombre = 'Tienda Online',
  descripcion = 'E-commerce con carrito de compras y sistema de pagos',
  url = 'tienda.html',
  imagen_url = 'img/robot.png',
  categoria = 'Comercio',
  destacado = false,
  orden = 3
WHERE id = 6;

-- Actualizar Sistema Citas (ID 7)
UPDATE proyectos_demo SET 
  nombre = 'Clínica Dental',
  descripcion = 'Sistema de gestión de citas médicas con recordatorios',
  url = 'demo-generator.html',
  imagen_url = 'img/demo-dental.svg',
  categoria = 'Salud',
  destacado = false,
  orden = 4
WHERE id = 7;

-- Borrar Portal de Servicios (ID 8)
DELETE FROM proyectos_demo WHERE id = 8;

-- Ver resultado
SELECT id, nombre, url, categoria, destacado FROM proyectos_demo ORDER BY orden;
