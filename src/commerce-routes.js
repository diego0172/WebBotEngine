import express from 'express';
import { verifyToken } from './auth-routes.js';
import pool from './database.js';

const router = express.Router();

// ===== Middleware para garantizar JSON en todas las respuestas =====
router.use((req, res, next) => {
  res.set('Content-Type', 'application/json; charset=utf-8');
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// ============= PRODUCTOS =============

// Obtener todos los productos
router.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ error: 'Error obteniendo productos', details: error.message });
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
    res.status(500).json({ error: 'Error creando producto', details: error.message });
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

// ============= PAGOS - PAGGO API =============

// Crear enlace de pago con Paggo
router.post('/transactions/create-link', async (req, res) => {
  try {
    const { concept, amount, customerName, email, metadata, orderId } = req.body;

    // Validar datos requeridos
    if (!concept || !amount || !email) {
      return res.status(400).json({ error: 'Faltan datos requeridos: concept, amount, email' });
    }

    // Token de Paggo (guardar en .env en producción)
    const PAGGO_TOKEN = process.env.PAGGO_TOKEN || 'pagg_92d7df9a00cc721f13786cd873508f6ef4e1158ab0c205fee2b5d407bf1e666f';

    // Construir payload para Paggo
    const paggoPayload = {
      concept: concept,
      amount: parseFloat(amount),
      customerName: customerName || 'Cliente',
      email: email,
      metadata: metadata || {}
    };

    // Agregar URL de redirección si existe
    if (metadata?.redirectUrl) {
      paggoPayload.metadata.redirectUrl = metadata.redirectUrl;
    } else {
      paggoPayload.metadata.redirectUrl = process.env.APP_URL || 'https://botenginecorp.com';
    }

    // Realizar petición a Paggo
    const response = await fetch('https://api.paggoapp.com/api/center/transactions/create-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAGGO_TOKEN}`
      },
      body: JSON.stringify(paggoPayload)
    });

    // Manejar respuesta de Paggo
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error Paggo:', errorData);
      return res.status(response.status).json({ 
        error: 'Error al crear enlace de pago',
        details: errorData 
      });
    }

    const paymentData = await response.json();

    // Guardar la transacción en la base de datos
    if (orderId) {
      try {
        await pool.query(
          `INSERT INTO orders (order_number, customer_name, email, total, status, payment_link) 
           VALUES ($1, $2, $3, $4, $5, $6) 
           ON CONFLICT (order_number) DO UPDATE SET payment_link=$6`,
          [orderId, customerName || 'Cliente', email, amount, 'pending', paymentData.link || paymentData.checkout_url]
        );
      } catch (dbError) {
        console.error('Error guardando en BD:', dbError);
        // No bloqueamos la respuesta si hay error en BD
      }
    }

    // Retornar el link de pago
    res.json({
      success: true,
      link: paymentData.link || paymentData.checkout_url,
      paymentData: paymentData
    });

  } catch (error) {
    console.error('Error en crear-link de transacción:', error);
    res.status(500).json({ 
      error: 'Error al procesar la solicitud',
      message: error.message 
    });
  }
});

// ============= GESTIÓN DE CLIENTES (PORTAFOLIO) =============

// Obtener todos los clientes activos (para mostrar en la página principal)
router.get('/clientes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM clientes WHERE activo = true ORDER BY orden ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    res.status(500).json({ error: 'Error obteniendo clientes' });
  }
});

// Obtener todos los clientes (incluyendo inactivos) - Solo para admin
router.get('/clientes/all', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM clientes ORDER BY orden ASC, id DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo todos los clientes:', error);
    res.status(500).json({ error: 'Error obteniendo clientes' });
  }
});

// Crear nuevo cliente - Solo para admin
router.post('/clientes', verifyToken, async (req, res) => {
  try {
    const { nombre, descripcion, url, imagen_url, orden, activo } = req.body;
    
    if (!nombre || !descripcion || !url || !imagen_url) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const result = await pool.query(
      `INSERT INTO clientes (nombre, descripcion, url, imagen_url, orden, activo) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [nombre, descripcion, url, imagen_url, orden || 0, activo !== false]
    );

    res.json({ message: 'Cliente creado', cliente: result.rows[0] });
  } catch (error) {
    console.error('Error creando cliente:', error);
    res.status(500).json({ error: 'Error creando cliente' });
  }
});

// Actualizar cliente - Solo para admin
router.put('/clientes/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, url, imagen_url, orden, activo } = req.body;

    const result = await pool.query(
      `UPDATE clientes 
       SET nombre = $1, descripcion = $2, url = $3, imagen_url = $4, orden = $5, activo = $6
       WHERE id = $7 
       RETURNING *`,
      [nombre, descripcion, url, imagen_url, orden, activo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ message: 'Cliente actualizado', cliente: result.rows[0] });
  } catch (error) {
    console.error('Error actualizando cliente:', error);
    res.status(500).json({ error: 'Error actualizando cliente' });
  }
});

// Eliminar cliente - Solo para admin
router.delete('/clientes/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM clientes WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ message: 'Cliente eliminado', cliente: result.rows[0] });
  } catch (error) {
    console.error('Error eliminando cliente:', error);
    res.status(500).json({ error: 'Error eliminando cliente' });
  }
});

// ============= PROYECTOS DEMO =============

// Obtener todos los demos activos (para mostrar en la galería pública)
router.get('/demos', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM proyectos_demo WHERE activo = true ORDER BY destacado DESC, orden ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo demos:', error);
    res.status(500).json({ error: 'Error obteniendo demos' });
  }
});

// Obtener todos los demos (incluyendo inactivos) - Solo para admin
router.get('/demos/all', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM proyectos_demo ORDER BY destacado DESC, orden ASC, id DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo todos los demos:', error);
    res.status(500).json({ error: 'Error obteniendo demos' });
  }
});

// Obtener demos por categoría
router.get('/demos/categoria/:categoria', async (req, res) => {
  try {
    const { categoria } = req.params;
    const result = await pool.query(
      'SELECT * FROM proyectos_demo WHERE categoria = $1 AND activo = true ORDER BY orden ASC',
      [categoria]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo demos por categoría:', error);
    res.status(500).json({ error: 'Error obteniendo demos' });
  }
});

// Crear nuevo demo - Solo para admin
router.post('/demos', verifyToken, async (req, res) => {
  try {
    const { nombre, descripcion, url, imagen_url, categoria, tecnologias, destacado, orden, activo } = req.body;
    
    if (!nombre || !descripcion || !url || !imagen_url || !categoria) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const result = await pool.query(
      `INSERT INTO proyectos_demo (nombre, descripcion, url, imagen_url, categoria, tecnologias, destacado, orden, activo) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [nombre, descripcion, url, imagen_url, categoria, tecnologias || null, destacado || false, orden || 0, activo !== false]
    );

    res.json({ message: 'Demo creado', demo: result.rows[0] });
  } catch (error) {
    console.error('Error creando demo:', error);
    res.status(500).json({ error: 'Error creando demo' });
  }
});

// Actualizar demo - Solo para admin
router.put('/demos/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, url, imagen_url, categoria, tecnologias, destacado, orden, activo } = req.body;

    const result = await pool.query(
      `UPDATE proyectos_demo 
       SET nombre = $1, descripcion = $2, url = $3, imagen_url = $4, categoria = $5, 
           tecnologias = $6, destacado = $7, orden = $8, activo = $9
       WHERE id = $10 
       RETURNING *`,
      [nombre, descripcion, url, imagen_url, categoria, tecnologias, destacado, orden, activo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Demo no encontrado' });
    }

    res.json({ message: 'Demo actualizado', demo: result.rows[0] });
  } catch (error) {
    console.error('Error actualizando demo:', error);
    res.status(500).json({ error: 'Error actualizando demo' });
  }
});

// Eliminar demo - Solo para admin
router.delete('/demos/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM proyectos_demo WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Demo no encontrado' });
    }

    res.json({ message: 'Demo eliminado', demo: result.rows[0] });
  } catch (error) {
    console.error('Error eliminando demo:', error);
    res.status(500).json({ error: 'Error eliminando demo' });
  }
});

// ============= TESTIMONIOS =============

// Obtener testimonios públicos (solo activos)
router.get('/testimonios', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM testimonios WHERE activo = true ORDER BY destacado DESC, orden ASC, calificacion DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo testimonios:', error);
    res.status(500).json({ error: 'Error obteniendo testimonios' });
  }
});

// Obtener todos los testimonios (admin)
router.get('/testimonios/all', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM testimonios ORDER BY destacado DESC, orden ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo todos los testimonios:', error);
    res.status(500).json({ error: 'Error obteniendo testimonios' });
  }
});

// Obtener testimonios destacados
router.get('/testimonios/destacados', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM testimonios WHERE activo = true AND destacado = true ORDER BY orden ASC LIMIT 6'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo testimonios destacados:', error);
    res.status(500).json({ error: 'Error obteniendo testimonios destacados' });
  }
});

// Crear testimonio (admin)
router.post('/testimonios', verifyToken, async (req, res) => {
  const { 
    nombre_cliente, 
    empresa, 
    cargo, 
    testimonio, 
    calificacion, 
    foto_url,
    proyecto_relacionado,
    fecha_testimonio,
    destacado, 
    verificado,
    orden, 
    activo 
  } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO testimonios 
       (nombre_cliente, empresa, cargo, testimonio, calificacion, foto_url, proyecto_relacionado, fecha_testimonio, destacado, verificado, orden, activo) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING *`,
      [nombre_cliente, empresa, cargo, testimonio, calificacion, foto_url, proyecto_relacionado, fecha_testimonio, destacado, verificado, orden, activo]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando testimonio:', error);
    res.status(500).json({ error: 'Error creando testimonio' });
  }
});

// Actualizar testimonio (admin)
router.put('/testimonios/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { 
    nombre_cliente, 
    empresa, 
    cargo, 
    testimonio, 
    calificacion, 
    foto_url,
    proyecto_relacionado,
    fecha_testimonio,
    destacado, 
    verificado,
    orden, 
    activo 
  } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE testimonios 
       SET nombre_cliente = $1, empresa = $2, cargo = $3, testimonio = $4, 
           calificacion = $5, foto_url = $6, proyecto_relacionado = $7, 
           fecha_testimonio = $8, destacado = $9, verificado = $10, 
           orden = $11, activo = $12
       WHERE id = $13 
       RETURNING *`,
      [nombre_cliente, empresa, cargo, testimonio, calificacion, foto_url, proyecto_relacionado, fecha_testimonio, destacado, verificado, orden, activo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Testimonio no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando testimonio:', error);
    res.status(500).json({ error: 'Error actualizando testimonio' });
  }
});

// Eliminar testimonio (admin)
router.delete('/testimonios/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      'DELETE FROM testimonios WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Testimonio no encontrado' });
    }

    res.json({ message: 'Testimonio eliminado', testimonio: result.rows[0] });
  } catch (error) {
    console.error('Error eliminando testimonio:', error);
    res.status(500).json({ error: 'Error eliminando testimonio' });
  }
});

export default router;