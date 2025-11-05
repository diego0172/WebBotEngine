#!/bin/bash
# 🚀 COMANDOS DE DESPLIEGUE DIGITALOCEAN

echo "=== PASO 1: CONECTAR AL SERVIDOR ==="
echo "ssh root@TU_IP_DROPLET"
echo ""

echo "=== PASO 2: INSTALAR DEPENDENCIAS ==="
echo "apt update && apt upgrade -y"
echo "curl -fsSL https://get.docker.com -o get-docker.sh"
echo "sh get-docker.sh"
echo "apt install -y git nginx certbot python3-certbot-nginx"
echo ""

echo "=== PASO 3: CONFIGURAR NGINX ==="
echo "nano /etc/nginx/sites-available/webbotengine"
echo ""

echo "=== PASO 4: SUBIR CÓDIGO ==="
echo "git clone https://github.com/diego0172/WebBotEngine.git"
echo "cd WebBotEngine"
echo ""

echo "=== PASO 5: CONFIGURAR VARIABLES ==="
echo "cp .env.production .env"
echo "nano .env"
echo ""

echo "=== PASO 6: CONSTRUIR Y EJECUTAR ==="
echo "docker build -t webbotengine ."
echo "docker run -d --name webbotengine --restart unless-stopped -p 3000:3000 webbotengine"
echo ""

echo "=== PASO 7: CONFIGURAR SSL ==="
echo "certbot --nginx -d tu-dominio.com"