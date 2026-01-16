// Utilidades para sincronizar con API y localStorage como fallback

const API_BASE = '/api/commerce';

class CommerceAPI {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    this.token = localStorage.getItem('adminToken');
    
    // Detectar cambios de conexión
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingOperations();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Obtener headers con autenticación
  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // ===== PRODUCTOS =====
  async getProducts() {
    try {
      if (!this.isOnline) {
        const cached = localStorage.getItem('products');
        return cached ? JSON.parse(cached) : [];
      }
      
      const response = await fetch(`${API_BASE}/products`, {
        headers: this.getHeaders(),
        cache: 'no-cache' // Asegurar que no use caché del navegador
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Error obteniendo productos`);
      }
      
      // Validar content-type ANTES de intentar parsear
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        console.error(`Respuesta con content-type inválido: ${contentType}`);
        throw new Error(`Respuesta no JSON: ${contentType}`);
      }
      
      // Intentar parsear la respuesta como JSON
      let products;
      try {
        products = await response.json();
      } catch (parseError) {
        console.error('Error parseando JSON:', parseError);
        // Si el JSON no es válido, usar localStorage como fallback
        const cached = localStorage.getItem('products');
        return cached ? JSON.parse(cached) : [];
      }
      
      // Solo cachear si es un array válido
      if (Array.isArray(products)) {
        localStorage.setItem('products', JSON.stringify(products));
        return products;
      } else {
        throw new Error('Respuesta de productos no es un array válido');
      }
      
    } catch (error) {
      console.warn('Error obteniendo productos de API, usando localStorage:', error.message);
      const cached = localStorage.getItem('products');
      return cached ? JSON.parse(cached) : [];
    }
  }

  async createProduct(productData) {
    try {
      if (!this.isOnline) {
        // Guardar en localStorage si está offline
        let products = JSON.parse(localStorage.getItem('products')) || [];
        const newProduct = { ...productData, id: Date.now() };
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        return newProduct;
      }
      
      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) throw new Error('Error creando producto');
      return await response.json();
    } catch (error) {
      console.error('Error creando producto:', error);
      throw error;
    }
  }

  async updateProduct(id, productData) {
    try {
      if (!this.isOnline) {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products = products.map(p => p.id === id ? { ...p, ...productData } : p);
        localStorage.setItem('products', JSON.stringify(products));
        return { ...productData, id };
      }
      
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) throw new Error('Error actualizando producto');
      return await response.json();
    } catch (error) {
      console.error('Error actualizando producto:', error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      if (!this.isOnline) {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        return { id };
      }
      
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      if (!response.ok) throw new Error('Error eliminando producto');
      return await response.json();
    } catch (error) {
      console.error('Error eliminando producto:', error);
      throw error;
    }
  }

  async decreaseStock(id, cantidad) {
    try {
      if (!this.isOnline) {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products = products.map(p => 
          p.id === id ? { ...p, stock: Math.max(0, p.stock - cantidad) } : p
        );
        localStorage.setItem('products', JSON.stringify(products));
        return { id };
      }
      
      const response = await fetch(`${API_BASE}/products/${id}/decrease-stock`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ cantidad })
      });
      
      if (!response.ok) throw new Error('Error actualizando stock');
      return await response.json();
    } catch (error) {
      console.error('Error actualizando stock:', error);
      throw error;
    }
  }

  // ===== PEDIDOS =====
  async getOrders() {
    try {
      if (!this.isOnline) {
        return JSON.parse(localStorage.getItem('orders')) || [];
      }
      
      const response = await fetch(`${API_BASE}/orders`, {
        headers: this.getHeaders()
      });
      if (!response.ok) throw new Error('Error obteniendo pedidos');
      
      const orders = await response.json();
      localStorage.setItem('orders', JSON.stringify(orders));
      return orders;
    } catch (error) {
      console.warn('Error obteniendo pedidos de API, usando localStorage:', error);
      return JSON.parse(localStorage.getItem('orders')) || [];
    }
  }

  async createOrder(orderData) {
    try {
      if (!this.isOnline) {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        const newOrder = { ...orderData, id: Date.now(), created_at: new Date().toISOString() };
        orders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        return newOrder;
      }
      
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) throw new Error('Error creando pedido');
      return await response.json();
    } catch (error) {
      console.error('Error creando pedido:', error);
      throw error;
    }
  }

  async getOrdersByEmail(email) {
    try {
      if (!this.isOnline) {
        const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
        return allOrders.filter(o => o.email === email);
      }
      
      const response = await fetch(`${API_BASE}/orders/${encodeURIComponent(email)}`, {
        headers: this.getHeaders()
      });
      if (!response.ok) throw new Error('Error obteniendo pedidos');
      return await response.json();
    } catch (error) {
      console.warn('Error obteniendo pedidos del email:', error);
      return [];
    }
  }

  // ===== CLIENTES (PORTAFOLIO) =====
  async getClientes() {
    try {
      if (!this.isOnline) {
        const cached = localStorage.getItem('clientes');
        return cached ? JSON.parse(cached) : [];
      }
      
      const response = await fetch(`${API_BASE}/clientes`, {
        headers: this.getHeaders(),
        cache: 'no-cache'
      });
      
      if (!response.ok) throw new Error('Error obteniendo clientes');
      
      const clientes = await response.json();
      localStorage.setItem('clientes', JSON.stringify(clientes));
      return clientes;
    } catch (error) {
      console.error('Error obteniendo clientes:', error);
      const cached = localStorage.getItem('clientes');
      return cached ? JSON.parse(cached) : [];
    }
  }

  async getAllClientes() {
    try {
      const response = await fetch(`${API_BASE}/clientes/all`, {
        headers: this.getHeaders(),
        cache: 'no-cache'
      });
      
      if (!response.ok) throw new Error('Error obteniendo todos los clientes');
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo todos los clientes:', error);
      return [];
    }
  }

  async createCliente(clienteData) {
    try {
      const response = await fetch(`${API_BASE}/clientes`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(clienteData)
      });
      
      if (!response.ok) throw new Error('Error creando cliente');
      const result = await response.json();
      
      // Actualizar caché
      await this.getClientes();
      return result;
    } catch (error) {
      console.error('Error creando cliente:', error);
      throw error;
    }
  }

  async updateCliente(id, clienteData) {
    try {
      const response = await fetch(`${API_BASE}/clientes/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(clienteData)
      });
      
      if (!response.ok) throw new Error('Error actualizando cliente');
      const result = await response.json();
      
      // Actualizar caché
      await this.getClientes();
      return result;
    } catch (error) {
      console.error('Error actualizando cliente:', error);
      throw error;
    }
  }

  async deleteCliente(id) {
    try {
      const response = await fetch(`${API_BASE}/clientes/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      if (!response.ok) throw new Error('Error eliminando cliente');
      const result = await response.json();
      
      // Actualizar caché
      await this.getClientes();
      return result;
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      throw error;
    }
  }

  // ===== PROYECTOS DEMO =====
  async getDemos() {
    try {
      if (!this.isOnline) {
        const cached = localStorage.getItem('demos');
        return cached ? JSON.parse(cached) : [];
      }
      
      const response = await fetch(`${API_BASE}/demos`, {
        headers: this.getHeaders(),
        cache: 'no-cache'
      });
      
      if (!response.ok) throw new Error('Error obteniendo demos');
      
      const demos = await response.json();
      localStorage.setItem('demos', JSON.stringify(demos));
      return demos;
    } catch (error) {
      console.error('Error obteniendo demos:', error);
      const cached = localStorage.getItem('demos');
      return cached ? JSON.parse(cached) : [];
    }
  }

  async getAllDemos() {
    try {
      const response = await fetch(`${API_BASE}/demos/all`, {
        headers: this.getHeaders(),
        cache: 'no-cache'
      });
      
      if (!response.ok) throw new Error('Error obteniendo todos los demos');
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo todos los demos:', error);
      return [];
    }
  }

  async getDemosByCategoria(categoria) {
    try {
      const response = await fetch(`${API_BASE}/demos/categoria/${encodeURIComponent(categoria)}`, {
        headers: this.getHeaders(),
        cache: 'no-cache'
      });
      
      if (!response.ok) throw new Error('Error obteniendo demos por categoría');
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo demos por categoría:', error);
      return [];
    }
  }

  async createDemo(demoData) {
    try {
      const response = await fetch(`${API_BASE}/demos`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(demoData)
      });
      
      if (!response.ok) throw new Error('Error creando demo');
      const result = await response.json();
      
      // Actualizar caché
      await this.getDemos();
      return result;
    } catch (error) {
      console.error('Error creando demo:', error);
      throw error;
    }
  }

  async updateDemo(id, demoData) {
    try {
      const response = await fetch(`${API_BASE}/demos/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(demoData)
      });
      
      if (!response.ok) throw new Error('Error actualizando demo');
      const result = await response.json();
      
      // Actualizar caché
      await this.getDemos();
      return result;
    } catch (error) {
      console.error('Error actualizando demo:', error);
      throw error;
    }
  }

  async deleteDemo(id) {
    try {
      const response = await fetch(`${API_BASE}/demos/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      if (!response.ok) throw new Error('Error eliminando demo');
      const result = await response.json();
      
      // Actualizar caché
      await this.getDemos();
      return result;
    } catch (error) {
      console.error('Error eliminando demo:', error);
      throw error;
    }
  }

  // ===== TESTIMONIOS =====
  async getTestimonios() {
    try {
      if (!this.isOnline) {
        const cached = localStorage.getItem('testimonios');
        return cached ? JSON.parse(cached) : [];
      }
      
      const response = await fetch(`${API_BASE}/testimonios`, {
        headers: this.getHeaders(),
        cache: 'no-cache'
      });
      
      if (!response.ok) throw new Error('Error obteniendo testimonios');
      const testimonios = await response.json();
      
      localStorage.setItem('testimonios', JSON.stringify(testimonios));
      return testimonios;
    } catch (error) {
      console.error('Error obteniendo testimonios:', error);
      const cached = localStorage.getItem('testimonios');
      return cached ? JSON.parse(cached) : [];
    }
  }

  async getAllTestimonios() {
    try {
      const response = await fetch(`${API_BASE}/testimonios/all`, {
        headers: this.getHeaders(),
        cache: 'no-cache'
      });
      
      if (!response.ok) throw new Error('Error obteniendo todos los testimonios');
      const testimonios = await response.json();
      
      localStorage.setItem('allTestimonios', JSON.stringify(testimonios));
      return testimonios;
    } catch (error) {
      console.error('Error obteniendo todos los testimonios:', error);
      const cached = localStorage.getItem('allTestimonios');
      return cached ? JSON.parse(cached) : [];
    }
  }

  async getTestimoniosDestacados() {
    try {
      const response = await fetch(`${API_BASE}/testimonios/destacados`, {
        headers: this.getHeaders(),
        cache: 'no-cache'
      });
      
      if (!response.ok) throw new Error('Error obteniendo testimonios destacados');
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo testimonios destacados:', error);
      return [];
    }
  }

  async createTestimonio(testimonioData) {
    try {
      const response = await fetch(`${API_BASE}/testimonios`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(testimonioData)
      });
      
      if (!response.ok) throw new Error('Error creando testimonio');
      const result = await response.json();
      
      // Actualizar caché
      await this.getAllTestimonios();
      return result;
    } catch (error) {
      console.error('Error creando testimonio:', error);
      throw error;
    }
  }

  async updateTestimonio(id, testimonioData) {
    try {
      const response = await fetch(`${API_BASE}/testimonios/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(testimonioData)
      });
      
      if (!response.ok) throw new Error('Error actualizando testimonio');
      const result = await response.json();
      
      // Actualizar caché
      await this.getAllTestimonios();
      return result;
    } catch (error) {
      console.error('Error actualizando testimonio:', error);
      throw error;
    }
  }

  async deleteTestimonio(id) {
    try {
      const response = await fetch(`${API_BASE}/testimonios/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      if (!response.ok) throw new Error('Error eliminando testimonio');
      const result = await response.json();
      
      // Actualizar caché
      await this.getAllTestimonios();
      return result;
    } catch (error) {
      console.error('Error eliminando testimonio:', error);
      throw error;
    }
  }

  // Sincronizar operaciones pendientes
  async syncPendingOperations() {
    if (this.syncQueue.length === 0) return;
    
    console.log('Sincronizando operaciones pendientes...');
    // Implementar lógica de sincronización si es necesario
    this.syncQueue = [];
  }
}

export const commerceAPI = new CommerceAPI();

