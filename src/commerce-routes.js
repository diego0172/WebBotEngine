import express from 'express';
import { verifyToken } from './auth-routes.js';
import pool from './database.js';

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

// Agregar nuevo producto (sin autenticación para permitir crear productos localmente)
router.post('/products', async (req, res) => {
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

// Descontar stock (sin autenticación para permitir desde el carrito)
router.post('/products/:id/decrease-stock', async (req, res) => {
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

// ============= CUPONES =============

// Validar cupón (sin autenticación para permitir desde el carrito)
router.post('/validate-coupon', async (req, res) => {
  const { code, totalAmount } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Código de cupón requerido' });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM coupons 
       WHERE code = $1 
       AND is_active = true 
       AND valid_from <= CURRENT_TIMESTAMP 
       AND valid_until >= CURRENT_TIMESTAMP
       AND (max_uses IS NULL OR current_uses < max_uses)`,
      [code.toUpperCase()]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Cupón inválido, expirado o agotado' });
    }

    const coupon = result.rows[0];

    // Validar compra mínima
    if (totalAmount < coupon.min_purchase) {
      return res.status(400).json({ 
        error: `Compra mínima requerida: Q ${coupon.min_purchase.toFixed(2)}` 
      });
    }

    // Calcular descuento
    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (totalAmount * coupon.discount_value) / 100;
    } else {
      discountAmount = coupon.discount_value;
    }

    res.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discountAmount: Math.min(discountAmount, totalAmount)
      }
    });
  } catch (error) {
    console.error('Error validando cupón:', error);
    res.status(500).json({ error: 'Error validando cupón' });
  }
});

// Obtener cupones (admin)
router.get('/coupons', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, code, description, discount_type, discount_value, min_purchase, max_uses, current_uses, valid_from, valid_until, is_active, created_at FROM coupons ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo cupones:', error);
    res.status(500).json({ error: 'Error obteniendo cupones' });
  }
});

// Crear cupón (admin)
router.post('/coupons', verifyToken, async (req, res) => {
  const { code, description, discount_type, discount_value, min_purchase, max_uses, valid_until } = req.body;

  if (!code || !discount_type || !discount_value || !valid_until) {
    return res.status(400).json({ error: 'Campos requeridos faltantes' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO coupons (code, description, discount_type, discount_value, min_purchase, max_uses, valid_until, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [code.toUpperCase(), description, discount_type, discount_value, min_purchase || 0, max_uses, valid_until, req.user?.email || 'admin']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Este código de cupón ya existe' });
    }
    console.error('Error creando cupón:', error);
    res.status(500).json({ error: 'Error creando cupón' });
  }
});

// Actualizar cupón (admin)
router.put('/coupons/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { code, description, discount_type, discount_value, min_purchase, max_uses, valid_until, is_active } = req.body;

  try {
    const result = await pool.query(
      `UPDATE coupons 
       SET code=$1, description=$2, discount_type=$3, discount_value=$4, min_purchase=$5, max_uses=$6, valid_until=$7, is_active=$8
       WHERE id=$9 RETURNING *`,
      [code?.toUpperCase() || code, description, discount_type, discount_value, min_purchase, max_uses, valid_until, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cupón no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando cupón:', error);
    res.status(500).json({ error: 'Error actualizando cupón' });
  }
});

// Eliminar cupón (admin)
router.delete('/coupons/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM coupons WHERE id=$1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cupón no encontrado' });
    }

    res.json({ message: 'Cupón eliminado', coupon: result.rows[0] });
  } catch (error) {
    console.error('Error eliminando cupón:', error);
    res.status(500).json({ error: 'Error eliminando cupón' });
  }
});

export default router;

