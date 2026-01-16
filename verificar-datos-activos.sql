-- Verificar qué datos hay realmente
SELECT 'Clientes con activo=true' as info, COUNT(*) FROM clientes WHERE activo = true;
SELECT 'Clientes totales' as info, COUNT(*) FROM clientes;

SELECT 'Testimonios con activo=true' as info, COUNT(*) FROM testimonios WHERE activo = true;
SELECT 'Testimonios totales' as info, COUNT(*) FROM testimonios;

-- Ver los primeros registros
SELECT id, nombre, activo FROM clientes LIMIT 5;
SELECT id, nombre_cliente, activo, destacado FROM testimonios LIMIT 5;
