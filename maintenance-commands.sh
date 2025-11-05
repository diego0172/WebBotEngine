#!/bin/bash
# 🔧 COMANDOS DE MANTENIMIENTO

echo "=== VER LOGS DE LA APLICACIÓN ==="
echo "docker logs webbotengine -f"
echo ""

echo "=== REINICIAR LA APLICACIÓN ==="
echo "docker restart webbotengine"
echo ""

echo "=== ACTUALIZAR LA APLICACIÓN ==="
echo "cd WebBotEngine"
echo "git pull origin main"
echo "docker build -t webbotengine ."
echo "docker stop webbotengine"
echo "docker rm webbotengine"
echo "docker run -d --name webbotengine --restart unless-stopped -p 3000:3000 webbotengine"
echo ""

echo "=== VER ESTADO DEL SERVIDOR ==="
echo "docker ps"
echo "systemctl status nginx"
echo "free -h"
echo "df -h"
echo ""

echo "=== BACKUP DE LA APLICACIÓN ==="
echo "tar -czf backup-$(date +%Y%m%d).tar.gz WebBotEngine"