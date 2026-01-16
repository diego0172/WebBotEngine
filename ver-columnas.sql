-- Verificar estructura de las tablas
SELECT 'clientes' as tabla, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'clientes' 
ORDER BY ordinal_position;

SELECT 'proyectos_demo' as tabla, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'proyectos_demo' 
ORDER BY ordinal_position;

SELECT 'testimonios' as tabla, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'testimonios' 
ORDER BY ordinal_position;
