-- Actualizar URLs de demos para que apunten a páginas demo específicas

UPDATE proyectos_demo SET 
  url = 'demo-generator.html?tipo=restaurante&nombre=Chatbot de Restaurante',
  imagen_url = 'img/demo-restaurante-gourmet.svg'
WHERE nombre = 'Chatbot de Restaurante';

UPDATE proyectos_demo SET 
  url = 'demo-generator.html?tipo=ecommerce&nombre=E-commerce Inteligente',
  imagen_url = 'img/robot.png'
WHERE nombre = 'E-commerce Inteligente';

UPDATE proyectos_demo SET 
  url = 'demo-generator.html?tipo=salud&nombre=Sistema de Citas Médicas',
  imagen_url = 'img/demo-dental.svg'
WHERE nombre = 'Sistema de Citas Médicas';

UPDATE proyectos_demo SET 
  url = 'demo-generator.html?tipo=servicios&nombre=Portal de Servicios',
  imagen_url = 'img/robot.png'
WHERE nombre = 'Portal de Servicios';

-- Agregar o actualizar demo de gimnasio
INSERT INTO proyectos_demo (nombre, descripcion, url, imagen_url, tecnologias, categoria, destacado, activo, orden)
VALUES 
  ('Gym Fitness Pro', 'Sitio web completo para gimnasio con planes de membresía y sistema de contacto', 
   'demo-gym.html', 'img/demo-gimnasio.svg', 'HTML5, CSS3, JavaScript, Responsive Design', 'Deportes', true, true, 5)
ON CONFLICT (nombre) DO UPDATE SET
  url = 'demo-gym.html',
  descripcion = 'Sitio web completo para gimnasio con planes de membresía y sistema de contacto',
  tecnologias = 'HTML5, CSS3, JavaScript, Responsive Design',
  destacado = true,
  activo = true;

-- Verificar cambios
SELECT id, nombre, url, imagen_url, categoria FROM proyectos_demo ORDER BY orden;

