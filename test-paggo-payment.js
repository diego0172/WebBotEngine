#!/usr/bin/env node
/**
 * Script de prueba para integración con Paggo
 * Uso: node test-paggo-payment.js
 */

const BASE_URL = 'http://localhost:3000';
const PAGGO_TOKEN = 'pagg_92d7df9a00cc721f13786cd873508f6ef4e1158ab0c205fee2b5d407bf1e666f';

// Datos de prueba
const paymentData = {
  concept: "Pedido No Orden: TEST-001",
  amount: 2.00,
  customerName: "Diego Chamale",
  email: "carloschamaleramirez@gmail.com",
  orderId: `ORD-${Date.now()}`,
  metadata: {
    redirectUrl: "https://botenginecorp.com",
    custom: {
      orderId: `ORD-${Date.now()}`,
      userId: "user_12345",
      plan: "premium",
      campaignId: "test_2025",
      isRecurring: false,
      nested: {
        orderId: `ORD-${Date.now()}`,
        userId: "user_12345",
        plan: "premium",
        campaignId: "test_2025",
        isRecurring: false
      }
    }
  }
};

async function testPaymentLink() {
  console.log('🧪 Probando integración de pagos con Paggo...\n');
  console.log('📤 Enviando datos:', JSON.stringify(paymentData, null, 2));
  console.log('\n⏳ Esperando respuesta del servidor...\n');
  
  try {
    const response = await fetch(`${BASE_URL}/api/commerce/transactions/create-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });
    
    console.log(`📊 Estado de respuesta: ${response.status} ${response.statusText}`);
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('\n✅ Éxito! Link de pago generado:\n');
      console.log('🔗 Link:', data.link || data.paymentData?.link || 'No encontrado');
      console.log('\n📋 Respuesta completa:');
      console.log(JSON.stringify(data, null, 2));
      
      if (data.link) {
        console.log('\n👉 Abre este enlace en tu navegador:');
        console.log(data.link);
      }
    } else {
      console.log('\n❌ Error en la respuesta:');
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('\n❌ Error al conectar con el servidor:');
    console.error(error.message);
    console.error('\n💡 Asegúrate de que el servidor esté ejecutándose en', BASE_URL);
  }
}

// Ejecutar prueba
testPaymentLink();
