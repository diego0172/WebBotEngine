-- Limpiar y actualizar proyectos demo
-- Eliminar duplicados y configurar URLs correctas

-- PASO 1: Eliminar los demos antiguos con URLs rotas (#demo-xxx)
DELETE FROM proyectos_demo WHERE url LIKE '#demo-%';

-- PASO 2: Actualizar URLs de los demos existentes
UPDATE proyectos_demo SET 
  url = 'demo-gym.html',
  nombre = 'Gym Fitness Pro',
  descripcion = 'Sitio web completo para gimnasio con planes de membresía, clases grupales y entrenamiento personalizado',
  imagen_url = 'img/demo-gimnasio.svg',
  categoria = 'Deportes',
  destacado = true,
  orden = 1
WHERE nombre = 'Gimnasio Fitness Pro' OR id = 3;

UPDATE proyectos_demo SET 
  url = 'demo-generator.html',
  nombre = 'Chatbot Restaurante',
  descripcion = 'Chatbot inteligente para tomar pedidos, reservas y consultas 24/7',
  imagen_url = 'img/demo-restaurante-gourmet.svg',
  categoria = 'Gastronomía',
  destacado = true,
  orden = 2
WHERE nombre LIKE '%Chatbot%Restaurante%' OR id = 5;

UPDATE proyectos_demo SET 
  url = 'tienda.html',
  nombre = 'E-commerce Inteligente',
  descripcion = 'Tienda online con sistema de productos, carrito y pagos integrados',
  imagen_url = 'img/robot.png',
  categoria = 'Comercio',
  destacado = false,
  orden = 3
WHERE nombre LIKE '%E-commerce%' OR id = 6;

UPDATE proyectos_demo SET 
  url = 'demo-generator.html',
  nombre = 'Sistema de Citas Médicas',
  descripcion = 'Plataforma para gestión de citas, recordatorios automáticos y seguimiento de pacientes',
  imagen_url = 'img/demo-dental.svg',
  categoria = 'Salud',
  destacado = false,
  orden = 4
WHERE nombre LIKE '%Citas%' OR id = 7;

-- PASO 3: Eliminar el demo genérico de servicios (no tenemos página para esto)
DELETE FROM proyectos_demo WHERE nombre = 'Portal de Servicios' OR id = 8;

-- PASO 4: Verificar resultado final
SELECT id, nombre, url, categoria, destacado, orden, activo 
FROM proyectos_demo 
ORDER BY orden, id;
