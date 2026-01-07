-- Script de migración para agregar columnas 'margin' y 'cost' a tabla 'products'
-- Ejecutar en la BD de producción

-- Agregar columna cost si no existe
ALTER TABLE products
ADD COLUMN IF NOT EXISTS cost DECIMAL(10, 2) DEFAULT 0;

-- Agregar columna margin si no existe
ALTER TABLE products
ADD COLUMN IF NOT EXISTS margin INTEGER DEFAULT 50;

-- Actualizar productos existentes sin margin a 50 por defecto
UPDATE products SET margin = 50 WHERE margin IS NULL;

-- Actualizar productos existentes sin cost a 0 por defecto
UPDATE products SET cost = 0 WHERE cost IS NULL;

-- Verificar que se agregaron correctamente
SELECT id, name, cost, margin, price, status FROM products LIMIT 10;
