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
        return JSON.parse(localStorage.getItem('products')) || [];
      }
      
      const response = await fetch(`${API_BASE}/products`, {
        headers: this.getHeaders()
      });
      if (!response.ok) throw new Error('Error obteniendo productos');
      
      const products = await response.json();
      localStorage.setItem('products', JSON.stringify(products));
      return products;
    } catch (error) {
      console.warn('Error obteniendo productos de API, usando localStorage:', error);
      return JSON.parse(localStorage.getItem('products')) || [];
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

  // Sincronizar operaciones pendientes
  async syncPendingOperations() {
    if (this.syncQueue.length === 0) return;
    
    console.log('Sincronizando operaciones pendientes...');
    // Implementar lógica de sincronización si es necesario
    this.syncQueue = [];
  }
}

export const commerceAPI = new CommerceAPI();
