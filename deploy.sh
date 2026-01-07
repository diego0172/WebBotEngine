#!/bin/bash

# Script de Deployment para WebBotEngine
# Uso: bash deploy.sh

set -e

echo "🚀 WebBotEngine Deployment Script"
echo "=================================="

# Verificar que Git está inicializado
if [ ! -d .git ]; then
    echo "❌ Git no está inicializado"
    echo "Inicializando Git..."
    git init
fi

# Verificar cambios
echo "📦 Verificando estado del repositorio..."
git status

# Agregar cambios
echo "📝 Agregando cambios..."
git add .

# Commit
read -p "📝 Ingresa mensaje de commit: " commit_msg
git commit -m "$commit_msg" || echo "ℹ️  No hay cambios para committear"

# Push
echo "🔄 Enviando a GitHub..."
git push origin main || echo "❌ Error al hacer push. ¿Configuraste el remote origin?"

echo ""
echo "✅ Script completado!"
echo ""
echo "📚 Próximos pasos:"
echo "1. Crea un repositorio en GitHub: https://github.com/new"
echo "2. Ejecuta: git remote add origin https://github.com/tu-usuario/botenginecorp.git"
echo "3. Ejecuta: git push -u origin main"
echo "4. Ve a tu plataforma (Railway, DigitalOcean, Heroku) y conecta el repositorio"
echo "5. ¡Listo! El deployment será automático en cada push"
echo ""
echo "📖 Para más detalles, ve a DEPLOYMENT.md"
