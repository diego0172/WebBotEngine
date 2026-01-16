#!/bin/bash
# Script de migración rápida para producción
# Ejecutar en el servidor de producción

echo "🚀 MIGRACIÓN RÁPIDA - PRODUCCIÓN"
echo "================================"
echo ""

# Leer credenciales de .env.production
if [ -f .env.production ]; then
    export $(cat .env.production | grep DATABASE_URL | xargs)
    echo "✅ Credenciales cargadas de .env.production"
else
    echo "❌ Error: No se encontró .env.production"
    exit 1
fi

echo ""
echo "📊 Ejecutando migraciones..."
echo ""

# Ejecutar migración
psql "$DATABASE_URL" -f MIGRACION-PRODUCCION-RAPIDA.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ MIGRACIONES COMPLETADAS"
    echo ""
    echo "🔄 Reiniciando servidor..."
    pm2 restart all
    echo ""
    echo "✨ ¡Todo listo! Verifica en: https://botenginecorp.com/admin-panel.html"
else
    echo ""
    echo "❌ Error ejecutando migraciones"
    exit 1
fi
