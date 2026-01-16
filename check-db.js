import pool from './src/database.js';

async function checkDatabase() {
  try {
    console.log('🔍 Verificando base de datos...\n');
    
    // Verificar tablas
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('clientes', 'proyectos_demo', 'testimonios')
      ORDER BY table_name
    `);
    
    console.log('📊 Tablas encontradas:', tablesResult.rows.map(r => r.table_name).join(', '));
    
    // Contar registros en cada tabla
    if (tablesResult.rows.some(r => r.table_name === 'clientes')) {
      const clientesCount = await pool.query('SELECT COUNT(*) FROM clientes');
      console.log('👥 Clientes:', clientesCount.rows[0].count);
      
      if (parseInt(clientesCount.rows[0].count) > 0) {
        const clientesSample = await pool.query('SELECT nombre FROM clientes LIMIT 3');
        console.log('   Ejemplos:', clientesSample.rows.map(r => r.nombre).join(', '));
      }
    } else {
      console.log('❌ Tabla "clientes" NO existe');
    }
    
    if (tablesResult.rows.some(r => r.table_name === 'testimonios')) {
      const testimoniosCount = await pool.query('SELECT COUNT(*) FROM testimonios');
      console.log('⭐ Testimonios:', testimoniosCount.rows[0].count);
      
      if (parseInt(testimoniosCount.rows[0].count) > 0) {
        const testimoniosSample = await pool.query('SELECT nombre_cliente FROM testimonios LIMIT 3');
        console.log('   Ejemplos:', testimoniosSample.rows.map(r => r.nombre_cliente).join(', '));
      }
    } else {
      console.log('❌ Tabla "testimonios" NO existe');
    }
    
    if (tablesResult.rows.some(r => r.table_name === 'proyectos_demo')) {
      const demosCount = await pool.query('SELECT COUNT(*) FROM proyectos_demo');
      console.log('🎨 Proyectos Demo:', demosCount.rows[0].count);
    } else {
      console.log('❌ Tabla "proyectos_demo" NO existe');
    }
    
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
