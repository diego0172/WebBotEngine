-- Script de migración para agregar columna 'status' a tabla 'products'
-- Ejecutar en la BD de producción

-- Agregar columna status si no existe
ALTER TABLE products
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'activo';

-- Actualizar productos existentes sin status a 'activo' por defecto
UPDATE products SET status = 'activo' WHERE status IS NULL OR status = '';

-- Verificar que se agregó correctamente
SELECT id, name, status, price, cost, margin FROM products LIMIT 10;
