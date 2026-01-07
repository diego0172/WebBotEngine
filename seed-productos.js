/**
 * Script para cargar los 3 productos principales en la tienda
 * Uso: node seed-productos.js
 */

import pool from './src/database.js';

const productos = [
  {
    name: 'Combo Teclado y Mouse para Oficina',
    description: 'Combo funcional para uso diario en casa u oficina. Instalación inmediata sin configuración. Producto nuevo y sellado. Entrega rápida en Ciudad de Guatemala con pago contra entrega.',
    price: 259,
    cost: 120,
    stock: 50,
    category: 'Combos',
    status: 'activo',
    image: null
  },
  {
    name: 'Combo Inalámbrico Teclado y Mouse para Hogar',
    description: 'Combo funcional para uso diario en casa u oficina. Libertad de cables para escriborios pequeños. Instalación inmediata sin configuración. Producto nuevo y sellado. Entrega rápida en Ciudad de Guatemala con pago contra entrega.',
    price: 299,
    cost: 150,
    stock: 30,
    category: 'Combos',
    status: 'activo',
    image: null
  },
  {
    name: 'Mouse USB Básico para Uso Diario',
    description: 'Mouse óptico USB básico para uso diario. Ideal como complemento o producto de entrada. Conexión plug and play sin instalación. Producto nuevo y sellado. Entrega rápida en Ciudad de Guatemala con pago contra entrega.',
    price: 159,
    cost: 75,
    stock: 100,
    category: 'Accesorios',
    status: 'activo',
    image: null
  }
];

async function seedProductos() {
  try {
    console.log('🌱 Cargando productos principales...\n');
    
    for (const producto of productos) {
      const result = await pool.query(
        `INSERT INTO products (name, description, price, cost, stock, category, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         ON CONFLICT (name) DO UPDATE SET 
         price = $3, cost = $4, stock = $5, status = $7
         RETURNING id, name, price`,
        [
          producto.name,
          producto.description,
          producto.price,
          producto.cost,
          producto.stock,
          producto.category,
          producto.status
        ]
      );
      
      if (result.rows.length > 0) {
        const prod = result.rows[0];
        console.log(`✅ ${prod.name}`);
        console.log(`   ID: ${prod.id}`);
        console.log(`   Precio: Q ${prod.price}`);
        console.log();
      }
    }
    
    console.log('🎉 Productos cargados exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cargando productos:', error.message);
    process.exit(1);
  }
}

seedProductos();
