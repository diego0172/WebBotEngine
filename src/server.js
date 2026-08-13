import express from "express";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { initializeDatabase } from "./database.js";
import commerceRoutes from "./commerce-routes.js";
import authRoutes from "./auth-routes.js";
import imageAnalysisRoutes from "./image-analysis-routes.js";

// Cargar variables de entorno - Intentar .env.production primero
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prodEnvFile = path.join(__dirname, '..', '.env.production');
const devEnvFile = path.join(__dirname, '..', '.env');

try {
  dotenv.config({ path: prodEnvFile });
} catch (err) {
  dotenv.config({ path: devEnvFile });
}

const app = express();
const port = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'production';

// Configuración simple para chatbot inteligente
const AI_PROVIDER = process.env.AI_PROVIDER || 'smart_patterns';





// Sistema de IA basado en patrones inteligentes (GRATIS y muy efectivo)
function getSmartPatternResponse(message, conversationHistory = []) {
  const msg = message.toLowerCase().trim();
  const context = conversationHistory.slice(-2).map(h => h.text.toLowerCase()).join(' ');
  
  // Análisis de intención múltiple
  const intentions = {
    greeting: msg.match(/hola|hi|hey|buenos|buenas|saludos|como estas/),
    chatbot: msg.match(/chatbot|bot|whatsapp|instagram|automatizar|respuestas automaticas/),
    web: msg.match(/web|página|sitio|website|diseño|landing|ecommerce|tienda/),
    automation: msg.match(/automatización|automatizar|procesos|workflow|integración/),
    pricing: msg.match(/precio|costo|cuánto|cuanto|cotización|presupuesto|tarifa/),
    services: msg.match(/servicios|qué hacen|que hacen|ofrecen|especialidad/),
    contact: msg.match(/contacto|teléfono|email|ubicación|dirección|como contactar/),
    demo: msg.match(/demo|prueba|ejemplo|mostrar|formulario|probar/),
    features: msg.match(/funciones|características|beneficios|ventajas|incluye/),
    comparison: msg.match(/diferencia|comparar|mejor|vs|versus|competencia/),
    timeline: msg.match(/tiempo|cuanto demora|cuando|plazo|entrega/),
    support: msg.match(/soporte|ayuda|problemas|error|falla/)
  };

  // Detectar preguntas sobre la IA
  if (msg.includes('eres ia') || msg.includes('eres real') || msg.includes('eres inteligencia artificial') || msg.includes('que tipo de ia')) {
    return "🤖 **¡Excelente pregunta!** Soy un asistente con **patrones inteligentes avanzados** - no soy IA como ChatGPT, pero tengo respuestas muy precisas sobre WebBotEngine.\n\n✅ **Mis respuestas son:**\n• Información 100% real y actualizada\n• Basada en datos reales de la página\n• Patrones inteligentes de conversación\n\n🎯 **¿Qué necesitas saber sobre nuestros servicios reales?**";
  }

  // Preguntas específicas sobre chatbots
  if (msg.includes('chatbot básico') || msg.includes('chatbot barato') || (msg.includes('chatbot') && (msg.includes('básico') || msg.includes('simple')))) {
    return "🤖 **Chatbot Básico Q1,500 - Q2,500:**\n\n✅ **Incluye:**\n• Respuestas automáticas a preguntas frecuentes\n• Menú simple con opciones básicas\n• Atención en horario definido por ti\n• Configuración para WhatsApp o web\n\n🎯 **Ideal para:**\n• Negocios pequeños\n• Respuestas rápidas sin procesos complejos\n• Primer chatbot para tu empresa\n\n⏰ **Entrega:** 3-5 días\n💬 **¿Te interesa? Contacta por WhatsApp +502-3123-9807**";
  }

  if (msg.includes('chatbot empresarial') || msg.includes('chatbot avanzado') || (msg.includes('chatbot') && (msg.includes('empresarial') || msg.includes('completo')))) {
    return "🏢 **Chatbot Empresarial Q5,000 - Q7,000+:**\n\n✅ **Incluye:**\n• Agendas y gestión de citas con confirmaciones\n• Integración con CRM y sistemas de terceros\n• Reportes detallados de interacciones\n• Soporte y actualizaciones personalizadas\n• Validaciones avanzadas de datos\n\n🎯 **Ideal para:**\n• Empresas con procesos complejos\n• Automatización completa de atención\n• Integración con sistemas internos\n\n⏰ **Entrega:** 2-4 semanas\n💬 **¿Necesitas una cotización específica?**";
  }

  // Preguntas específicas sobre páginas web
  if (msg.includes('página básica') || msg.includes('sitio básico') || (msg.includes('página') && msg.includes('básic'))) {
    return "🌐 **Página Web Básica Q1,500 - Q2,500:**\n\n✅ **Incluye:**\n• Página informativa de 3-4 secciones\n• Sección de productos con imágenes y precios\n• Botones de contacto directo a WhatsApp\n• Optimización para celular y tablet\n• Enlaces a redes sociales\n\n🎯 **Ideal para:**\n• Negocios que quieren presencia en línea\n• Mostrar productos/servicios profesionalmente\n• No necesitas vender online directamente\n\n⏰ **Entrega:** 5-7 días\n💬 **¿Quieres ver ejemplos?**";
  }

  if (msg.includes('ecommerce') || msg.includes('tienda online') || msg.includes('carrito') || (msg.includes('página') && msg.includes('avanzad'))) {
    return "🛒 **Página Web Avanzada Q6,000 - Q8,000+:**\n\n✅ **Incluye:**\n• Carrito de compras funcional\n• Integración con pagos en línea\n• Gestión de inventario básico\n• Testimonios y reseñas de clientes\n• Soporte post-lanzamiento 1 mes completo\n• Panel administrativo\n\n🎯 **Ideal para:**\n• Vender productos directamente desde tu web\n• Tiendas que quieren automatizar ventas\n• Negocios en crecimiento\n\n⏰ **Entrega:** 2-3 semanas\n💬 **¿Qué productos quieres vender online?**";
  }

  // Respuestas contextuales inteligentes
  if (intentions.greeting) {
    const greetings = [
      "¡Hola! 👋 Soy el asistente inteligente de WebBotEngine. Tengo información precisa sobre chatbots, páginas web y automatización. ¿En qué te puedo ayudar?",
      "¡Bienvenido! 🤖 WebBotEngine - especialistas en chatbots y páginas web modernas. ¿Qué servicio te interesa?",
      "¡Hola! 🚀 Soy tu asistente de WebBotEngine con información real y actualizada. ¿Necesitas chatbot, página web o automatización?"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  if (intentions.chatbot) {
    if (context.includes('precio') || intentions.pricing) {
      return "🤖 ¡Perfecto! Nuestros chatbots desde $299 USD incluyen:\n• Integración WhatsApp e Instagram\n• Respuestas 24/7 automáticas\n• Panel de administración\n• Soporte técnico\n\n¿Te gustaría una demo personalizada?";
    }
    return "🤖 ¡Excelente elección! Nuestros chatbots inteligentes automatizan respuestas en WhatsApp, Instagram y web las 24 horas. Aumentan ventas y mejoran atención al cliente. Desde $299 USD. ¿Qué plataforma te interesa más?";
  }

  if (intentions.web) {
    if (context.includes('precio') || intentions.pricing) {
      return "🌐 **PÁGINAS WEB - Precios reales:**\n\n• **Básico**: Q1,500 - Q2,500 (3-4 secciones)\n• **Intermedio**: Q3,500 - Q5,000 (Hasta 20 productos)\n• **Avanzado**: Q6,000 - Q8,000+ (Carrito de compras)\n\n✅ Diseño responsivo incluido\n✅ Optimización SEO básica\n✅ Botones directos a WhatsApp\n\n¿Qué tipo de sitio necesitas?";
    }
    return "🌐 **Páginas Web Profesionales:**\n\nCreamos sitios modernos que convierten visitantes en clientes:\n• Diseño responsivo y rápido\n• Optimización SEO incluida\n• Desde páginas informativas hasta tiendas online\n\n💰 **Precios desde Q1,500**\n\n¿Qué tipo de página necesitas? ¿Informativa o tienda online?";
  }

  if (intentions.pricing) {
    return "💰 **PRECIOS OFICIALES WebBotEngine:**\n\n🤖 **CHATBOTS** (WhatsApp, Instagram, Web):\n• **Básico**: Q1,500 - Q2,500\n  ✓ Respuestas automáticas FAQ\n  ✓ Menú simple con opciones básicas\n\n• **Interactivo**: Q3,000 - Q4,000\n  ✓ Flujos conversacionales por pasos\n  ✓ Validación de datos (correos, teléfonos)\n\n• **Empresarial**: Q5,000 - Q7,000+\n  ✓ Agendas y gestión de citas\n  ✓ Integración con CRM\n\n🌐 **PÁGINAS WEB**:\n• **Básico**: Q1,500 - Q2,500 (3-4 secciones informativas)\n• **Intermedio**: Q3,500 - Q5,000 (Hasta 20 productos)\n• **Avanzado**: Q6,000 - Q8,000+ (Carrito de compras)\n\n🛠️ **MANTENIMIENTO PC**: Q200.00\n\n💬 ¿Cuál te interesa? ¡Te doy más detalles!";
  }

  if (intentions.services) {
    return "🚀 **WebBotEngine - Nuestros Servicios:**\n\n🤖 **Chatbots Inteligentes**\n   • Automatiza respuestas en WhatsApp, Instagram y web\n   • Atención a clientes 24/7 sin descanso\n   • Desde Q1,500 hasta Q7,000+ según complejidad\n\n🌐 **Diseño Web Moderno**\n   • Sitios rápidos, seguros y optimizados\n   • Desde páginas informativas hasta tiendas online\n   • Optimización SEO básica incluida\n   • Desde Q1,500 hasta Q8,000+ según funciones\n\n⚙️ **Automatización de Procesos**\n   • Integramos herramientas para ahorrar tiempo\n   • Agendamiento, recordatorios y seguimiento\n   • Conexión con WhatsApp y redes sociales\n\n🛠️ **Mantenimiento de Computadoras**\n   • Limpieza preventiva Q200.00\n   • Cambio pasta térmica y limpieza completa\n\n¿Qué servicio necesitas para tu negocio?";
  }

  if (intentions.contact) {
    return "📞 **¡Hablemos de tu proyecto!**\n\n💬 **WhatsApp**: +502-3123-9807 (REAL y funcionando)\n� **Instagram**: @botenginecorp\n💼 **LinkedIn**: /company/botenginecorp\n📋 **Formulario**: Complétalo aquí en la página\n\n🕒 Respondemos rápido por WhatsApp\n🆓 Consulta inicial gratuita\n\n¿Prefieres contacto por WhatsApp o formulario?";
  }

  if (intentions.demo) {
    return "🎯 **¡Demo Personalizada Gratis!**\n\nPara preparar tu demo perfecta necesito:\n✅ Tipo de negocio\n✅ Plataforma principal (Web/WhatsApp/Instagram)\n✅ Objetivo principal\n\n📋 Completa el formulario aquí o cuéntame más detalles. Te contactaremos en 24 horas con una propuesta personalizada.";
  }

  if (intentions.features) {
    return "⭐ **Características destacadas:**\n\n🤖 **Chatbots**:\n• IA conversacional\n• Múltiples idiomas\n• Analytics integrado\n• API personalizable\n\n🌐 **Web**:\n• Diseño único\n• Velocidad optimizada\n• Mobile-first\n• SEO avanzado\n\n¿Qué funcionalidad específica necesitas?";
  }

  if (intentions.timeline) {
    return "⏰ **Tiempos de entrega:**\n\n🤖 **Chatbot básico**: 3-5 días\n🌐 **Landing page**: 5-7 días\n🌐 **Sitio web completo**: 2-3 semanas\n⚙️ **Automatización**: 1-4 semanas\n\n🚀 **Servicio express** disponible\n📞 ¿Tienes urgencia? ¡Contactanos!";
  }

  if (intentions.support) {
    return "🛠️ **Soporte técnico incluido:**\n\n✅ Soporte 24/7 por WhatsApp\n✅ Actualizaciones gratuitas primer año\n✅ Capacitación para tu equipo\n✅ Garantía de funcionamiento\n\n¿Tienes algún problema específico que necesitas resolver?";
  }

  // Análisis de palabras clave para respuestas dinámicas
  if (msg.includes('why') || msg.includes('por qué') || msg.includes('porque')) {
    return "🎯 **¿Por qué WebBotEngine?**\n\n✅ +500 clientes satisfechos\n✅ Respuesta en menos de 2 horas\n✅ Tecnología de punta\n✅ Precios transparentes\n✅ Soporte en español\n\n💡 Nos enfocamos en **resultados**, no solo en entregar. ¿Qué te preocupa de otros proveedores?";
  }

  // Respuesta inteligente por defecto
  return "🤔 Te puedo ayudar con información específica sobre:\n\n🤖 **Chatbots** (Q1,500 - Q7,000+)\n🌐 **Páginas Web** (Q1,500 - Q8,000+)\n🛠️ **Mantenimiento PC** (Q200)\n\n📞 **Contacto real:**\n💬 **WhatsApp**: +502-3123-9807\n📋 **Formulario**: Complétalo en esta página\n� **Instagram**: @botenginecorp\n\n¿Qué servicio te interesa más?";
}


const PUBLIC_DIR = path.join(__dirname, "..", "public");

// ===== Middleware de Seguridad y Performance =====
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcAttr: ["'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com", "https://fonts.gstatic.com", "https://api.paggoapp.com"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Compresión GZIP
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
  threshold: 1024, // Solo comprimir archivos > 1KB
  level: 6 // Nivel de compresión balanceado
}));

// Logging en desarrollo
if (isDev) {
  app.use(morgan('dev'));
}

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== Headers de Performance =====
app.use((req, res, next) => {
  // Cache headers para assets estáticos
  if (req.path.match(/\.(css|js|png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|eot)$/)) {
    res.set('Cache-Control', 'public, max-age=31536000, immutable'); // 1 año
  } else if (req.path === '/' || req.path.includes('.html')) {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  } else if (req.path.startsWith('/api')) {
    // Nunca cachear respuestas API
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
  
  // Headers de performance
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Frame-Options', 'DENY');
  res.set('X-XSS-Protection', '1; mode=block');
  
  next();
});

// ===== Middleware para garantizar respuestas JSON en API =====
app.use('/api', (req, res, next) => {
  // Asegurar que las respuestas API sean siempre JSON, nunca HTML
  const originalJson = res.json.bind(res);
  res.json = function(data) {
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    return originalJson(data);
  };
  next();
});

// ===== Rutas API =====

// API del Chatbot - Simple y funcional
app.post('/api/chat', (req, res) => {
  console.log('🤖 Petición recibida:', req.body);
  
  const { message, conversationHistory = [] } = req.body;
  
  if (!message || message.trim().length === 0) {
    return res.status(400).json({ 
      ok: false, 
      error: 'Mensaje requerido' 
    });
  }

  // Usar sistema de patrones inteligente
  const response = getSmartPatternResponse(message, conversationHistory);
  
  console.log('✅ Respuesta:', response);

  res.json({ 
    ok: true, 
    message: response,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/demo', async (req, res) => {
  try {
    const { nombre, email, telefono, mensaje } = req.body;
    
    // Validación básica
    if (!nombre || !email || !telefono) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Faltan campos requeridos' 
      });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Email inválido' 
      });
    }

    // Aquí podrías integrar con un servicio de email como Nodemailer
    console.log('Nueva solicitud de demo:', { nombre, email, telefono, mensaje });
    
    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 500));
    
    res.json({ 
      ok: true, 
      message: 'Solicitud recibida correctamente' 
    });
    
  } catch (error) {
    console.error('Error en /api/demo:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Error interno del servidor' 
    });
  }
});

// ===== Servir archivos estáticos con optimizaciones =====
app.use(express.static(PUBLIC_DIR, {
  maxAge: isDev ? 0 : '1y', // Cache en producción
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    // Headers específicos por tipo de archivo
    if (path.endsWith('.html')) {
      res.set('Cache-Control', 'no-cache');
    } else if (path.match(/\.(css|js)$/)) {
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (path.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/)) {
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// ===== Rutas de Autenticación =====
app.use('/api', authRoutes);

// ===== Rutas de Análisis de Imágenes =====
app.use('/api', imageAnalysisRoutes);

// ===== Rutas de Comercio (API) =====
app.use('/api/commerce', commerceRoutes);

// ===== Health Check =====
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ===== SPA fallback - SOLO para rutas que no sean API =====
app.get("*", (req, res) => {
  // No servir index.html para rutas API que no fueron encontradas
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Ruta API no encontrada' });
  }
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

// ===== Error handling =====
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Asegurar que siempre se devuelva JSON para rutas API
  if (req.path.startsWith('/api')) {
    return res.status(500).json({ 
      error: isDev ? err.message : 'Error interno del servidor',
      ok: false
    });
  }
  
  res.status(500).json({ 
    ok: false, 
    error: isDev ? err.message : 'Error interno del servidor' 
  });
});

// ===== Iniciar servidor =====
const server = app.listen(port, async () => {
  // Inicializar base de datos
  await initializeDatabase();
  
  console.log(`🚀 WebBotEngine running on port ${port}`);
  console.log(`📁 Serving static files from: ${PUBLIC_DIR}`);
  console.log(`🌍 Environment: ${isDev ? 'development' : 'production'}`);
  console.log(`💾 Database: PostgreSQL DigitalOcean conectada`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;
