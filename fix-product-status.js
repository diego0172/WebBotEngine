/**
 * Script para actualizar status de productos existentes
 * Uso: node fix-product-status.js
 */

import pool from './src/database.js';

async function fixProductStatus() {
  try {
    console.log('🔧 Actualizando status de productos...\n');
    
    const result = await pool.query(
      `UPDATE products 
       SET status = 'activo' 
       WHERE status IS NULL OR status = ''
       RETURNING id, name, status`
    );
    
    console.log(`✅ Actualizado ${result.rows.length} productos\n`);
    
    result.rows.forEach(prod => {
      console.log(`  ✓ ${prod.name} → ${prod.status}`);
    });
    
    console.log('\n✅ Todos los productos ahora están activos!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error actualizando status:', error.message);
    process.exit(1);
  }
}

fixProductStatus();
