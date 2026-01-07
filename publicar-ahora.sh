#!/usr/bin/env bash
# PUBLICAR WEBBOTENGINECORP EN VIVO - PASOS RÁPIDOS

# Cambia TU-USUARIO por tu usuario de GitHub

echo "🚀 WebBotEngine - Publicación Rápida"
echo "===================================="
echo ""

# Paso 1: Inicializar Git
echo "📝 Paso 1: Inicializando Git..."
git init
git add .
git commit -m "WebBotEngine v1.0 - Producción lista"

# Paso 2: Agregar remoto
echo "🔗 Paso 2: Agregando remoto a GitHub..."
read -p "¿Cuál es tu usuario de GitHub? " GITHUB_USER
git remote add origin https://github.com/$GITHUB_USER/botenginecorp.git
git branch -M main

# Paso 3: Push
echo "📤 Paso 3: Enviando a GitHub..."
git push -u origin main

echo ""
echo "✅ Código enviado a GitHub"
echo ""
echo "📱 Ahora abre https://railway.app y sigue estos pasos:"
echo ""
echo "  1. Click en 'Start a Project'"
echo "  2. 'Deploy from GitHub repo'"
echo "  3. Autoriza GitHub"
echo "  4. Selecciona 'botenginecorp'"
echo "  5. Click en 'Add Service' → PostgreSQL"
echo "  6. Configura estas variables:"
echo ""
echo "     NODE_ENV=production"
echo "     JWT_SECRET=tu-jwt-secret-super-seguro-aqui"
echo "     PAGGO_API_KEY=tu-api-key-paggo"
echo "     DATABASE_URL=(automático con PostgreSQL)"
echo ""
echo "  7. Click en 'Deploy'"
echo "  8. ¡Espera 2-3 minutos!"
echo ""
echo "📚 Para más detalles: Lee GUIA_PUBLICACION.md"
echo ""
echo "🎉 ¡Listo para vivo!"
