import express from 'express';
import pool from './database.js';
import { verifyToken } from './auth-routes.js';

const router = express.Router();

// ============= PRODUCTOS =============

// Obtener todos los productos
router.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ error: 'Error obteniendo productos' });
  }
});

// Agregar nuevo producto
router.post('/products', verifyToken, async (req, res) => {
  const { name, description, price, stock, category, image } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, price, stock, category, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, stock, category, image]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({ error: 'Error creando producto' });
  }
});

// Actualizar producto
router.put('/products/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category, image } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE products SET name=$1, description=$2, price=$3, stock=$4, category=$5, image=$6, updated_at=CURRENT_TIMESTAMP WHERE id=$7 RETURNING *',
      [name, description, price, stock, category, image, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ error: 'Error actualizando producto' });
  }
});

// Eliminar producto
router.delete('/products/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM products WHERE id=$1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({ message: 'Producto eliminado', product: result.rows[0] });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ error: 'Error eliminando producto' });
  }
});

// Descontar stock
router.post('/products/:id/decrease-stock', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE products SET stock = GREATEST(0, stock - $1), updated_at=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *',
      [cantidad, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando stock:', error);
    res.status(500).json({ error: 'Error actualizando stock' });
  }
});

// ============= PEDIDOS =============

// Obtener todos los pedidos
router.get('/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    res.status(500).json({ error: 'Error obteniendo pedidos' });
  }
});

// Crear nuevo pedido
router.post('/orders', async (req, res) => {
  const { email, items, total } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO orders (email, items, total) VALUES ($1, $2, $3) RETURNING *',
      [email, JSON.stringify(items), total]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando pedido:', error);
    res.status(500).json({ error: 'Error creando pedido' });
  }
});

// Obtener pedidos por email
router.get('/orders/:email', async (req, res) => {
  const { email } = req.params;
  
  try {
    const result = await pool.query('SELECT * FROM orders WHERE email=$1 ORDER BY created_at DESC', [email]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    res.status(500).json({ error: 'Error obteniendo pedidos' });
  }
});

export default router;
