-- Migración para agregar tabla de testimonios/reseñas
-- Fecha: 2026-01-15

-- Crear tabla de testimonios
CREATE TABLE IF NOT EXISTS testimonios (
    id SERIAL PRIMARY KEY,
    nombre_cliente VARCHAR(255) NOT NULL,
    empresa VARCHAR(255),
    cargo VARCHAR(255),
    testimonio TEXT NOT NULL,
    calificacion INTEGER CHECK (calificacion >= 1 AND calificacion <= 5),
    foto_url VARCHAR(500),
    proyecto_relacionado VARCHAR(255),
    fecha_testimonio DATE DEFAULT CURRENT_DATE,
    destacado BOOLEAN DEFAULT false,
    verificado BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    orden INTEGER DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_testimonios_activo ON testimonios(activo);
CREATE INDEX idx_testimonios_destacado ON testimonios(destacado);
CREATE INDEX idx_testimonios_calificacion ON testimonios(calificacion);
CREATE INDEX idx_testimonios_verificado ON testimonios(verificado);

-- Trigger para actualizar fecha_actualizacion
CREATE TRIGGER actualizar_fecha_testimonios
    BEFORE UPDATE ON testimonios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_actualizacion();

-- Insertar testimonios de ejemplo
INSERT INTO testimonios (nombre_cliente, empresa, cargo, testimonio, calificacion, foto_url, proyecto_relacionado, destacado, verificado, orden, activo) VALUES
(
    'María González',
    'Café Aromático',
    'Gerente General',
    'El chatbot de BotEngine revolucionó nuestra atención al cliente. Ahora respondemos consultas 24/7 sin necesidad de personal extra. Las ventas aumentaron un 40% desde que lo implementamos.',
    5,
    'img/testimonio-maria.jpg',
    'Chatbot para Restaurante',
    true,
    true,
    1,
    true
),
(
    'Carlos Méndez',
    'AutoParts Guatemala',
    'Director de Marketing',
    'Nuestro nuevo sitio web es increíble. Rápido, moderno y con excelente SEO. Hemos duplicado las consultas en solo 2 meses. Totalmente recomendados.',
    5,
    'img/testimonio-carlos.jpg',
    'Diseño Web Corporativo',
    true,
    true,
    2,
    true
),
(
    'Ana Rodríguez',
    'Belleza Total Spa',
    'Propietaria',
    'El sistema de reservas automático que desarrollaron para nosotros es espectacular. Ya no perdemos clientes por no contestar el teléfono. Todo se gestiona automáticamente vía WhatsApp.',
    5,
    'img/testimonio-ana.jpg',
    'Sistema de Reservas',
    true,
    true,
    3,
    true
),
(
    'Roberto Pérez',
    'TechStore GT',
    'CEO',
    'BotEngine nos ayudó a automatizar todo nuestro proceso de ventas. El chatbot responde preguntas, envía catálogos y procesa pedidos. Una inversión que se pagó sola en 3 meses.',
    5,
    'img/testimonio-roberto.jpg',
    'E-commerce + Chatbot',
    false,
    true,
    4,
    true
),
(
    'Laura Castillo',
    'Clínica Dental Sonrisa',
    'Administradora',
    'El sitio web que nos diseñaron atrae muchos más pacientes. La integración con el chatbot permite agendar citas automáticamente. Profesionalismo y calidad en todo momento.',
    5,
    'img/testimonio-laura.jpg',
    'Web + Chatbot Médico',
    false,
    true,
    5,
    true
),
(
    'Jorge Ramírez',
    'Gimnasio FitZone',
    'Gerente',
    'Excelente trabajo. El chatbot responde dudas sobre horarios, planes y promociones automáticamente. Nuestro personal ahora se enfoca en atender a los clientes en el gimnasio.',
    4,
    'img/testimonio-jorge.jpg',
    'Chatbot WhatsApp',
    false,
    true,
    6,
    true
);

-- Verificación
SELECT 
    nombre_cliente, 
    empresa, 
    calificacion, 
    destacado,
    verificado
FROM testimonios 
ORDER BY destacado DESC, orden ASC;

-- Comentarios
COMMENT ON TABLE testimonios IS 'Testimonios y reseñas de clientes para mostrar credibilidad y casos de éxito';
COMMENT ON COLUMN testimonios.calificacion IS 'Calificación de 1 a 5 estrellas';
COMMENT ON COLUMN testimonios.destacado IS 'Marcar testimonios para mostrar en sección principal';
COMMENT ON COLUMN testimonios.verificado IS 'Indica si el testimonio ha sido verificado como auténtico';
