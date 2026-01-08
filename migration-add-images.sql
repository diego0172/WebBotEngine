-- Script de migración para agregar galería de imágenes
-- Ejecutar en la BD de producción

-- Agregar columna images para guardar múltiples imágenes en JSON
ALTER TABLE products
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]';

-- Migrar imagen única a galería (si existe)
UPDATE products 
SET images = jsonb_build_array(jsonb_build_object('url', image, 'alt', name))
WHERE image IS NOT NULL AND images = '[]';

-- Verificar que se agregó correctamente
SELECT id, name, image, images FROM products LIMIT 5;
