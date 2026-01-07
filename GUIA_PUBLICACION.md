# 🎯 PASOS PARA PUBLICAR EN VIVO - WebBotEngine

## **PASO 1: Crear Repositorio en GitHub** ⚡

1. Ve a **https://github.com/new**
2. Nombre: `botenginecorp`
3. Descripción: `E-commerce y ChatBot AI para pequeños negocios`
4. Visibilidad: Public
5. Haz clic en "Create repository"

## **PASO 2: Preparar el Código Localmente** 📦

```powershell
# En PowerShell en tu carpeta WebBotEngine:

# 1. Inicializar Git si no está
git init

# 2. Agregar todos los archivos
git add .

# 3. Primer commit
git commit -m "WebBotEngine v1.0 - Tienda y ChatBot listo para producción"

# 4. Renombrar rama a main (si no lo está)
git branch -M main

# 5. Agregar el remoto de GitHub (REEMPLAZA TU-USUARIO)
git remote add origin https://github.com/TU-USUARIO/botenginecorp.git

# 6. Enviar a GitHub
git push -u origin main
```

## **PASO 3: Escoger Plataforma de Hosting** 🌐

### **OPCIÓN A: Railway (MÁS FÁCIL) ⭐**

1. Ve a **https://railway.app**
2. Haz clic en "Start a Project"
3. Selecciona "Deploy from GitHub repo"
4. Autoriza Railway para acceder a GitHub
5. Selecciona tu repositorio `botenginecorp`
6. Railway detectará Node.js automáticamente

**Agregar Base de Datos:**
- Haz clic en "Add Service"
- Selecciona "PostgreSQL"
- La BD se creará automáticamente

**Configurar Variables de Ambiente:**
- En tu app > "Variables"
- Agrega estas variables:

```
NODE_ENV=production
JWT_SECRET=tu-jwt-secret-super-seguro-aqui-min-32-caracteres
PAGGO_API_KEY=tu-api-key-de-paggo
DATABASE_URL=postgresql://... (se genera automáticamente con PostgreSQL)
```

**Deploy:**
- Haz clic en "Deploy"
- ¡Listo en 2-3 minutos!

Tu app estará en: `https://botenginecorp-production.up.railway.app`

---

### **OPCIÓN B: DigitalOcean App Platform** 🌊

1. Ve a **https://cloud.digitalocean.com/apps**
2. Haz clic en "Create App"
3. Selecciona "GitHub"
4. Autoriza DigitalOcean
5. Selecciona `botenginecorp`
6. Rama: `main`

**Configurar Service:**
- Name: `web`
- Build Command: `npm install`
- Run Command: `npm start`
- Port: `3000`

**Agregar Variables:**
```
NODE_ENV=production
JWT_SECRET=tu-jwt-secret-super-seguro-aqui-min-32-caracteres
PAGGO_API_KEY=tu-api-key-de-paggo
```

**Agregar Database:**
- Haz clic en "Create Database"
- Engine: PostgreSQL
- Name: `botenginecorp`

**Deploy:**
- Haz clic en "Deploy"
- Espera 5-10 minutos

Tu app estará en: `https://botenginecorp-XXXXX.ondigitalocean.app`

---

### **OPCIÓN C: Heroku** 

1. Instala **Heroku CLI**: https://devcenter.heroku.com/articles/heroku-cli
2. En PowerShell:

```powershell
heroku login
heroku create botenginecorp
heroku addons:create heroku-postgresql:hobby-dev

# Variables de ambiente
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=tu-jwt-secret-super-seguro-aqui
heroku config:set PAGGO_API_KEY=tu-api-key-de-paggo

# Deploy
git push heroku main
```

Tu app estará en: `https://botenginecorp.herokuapp.com`

---

## **PASO 4: Configurar Dominio Personalizado** 🌍

Si tienes `botenginecorp.com`:

### Con Railway:
1. Ve a Settings > Domains
2. Agregar custom domain
3. Sigue las instrucciones de DNS

### Con DigitalOcean:
1. Ve a App > Settings > Domains
2. Agregar tu dominio
3. Cambia los nameservers en tu registrador

### Con Heroku:
1. Ve a Settings > Domains
2. Agregar tu dominio
3. Copia el DNS CNAME

---

## **PASO 5: Verificar que Todo Funciona** ✅

```powershell
# Reemplaza con tu URL real

# 1. Verificar que la app está viva
curl https://tu-app-url.com

# 2. Probar login (si tienes endpoint health check)
$headers = @{'Content-Type' = 'application/json'}
$body = '{"username":"admin","password":"Dudimeda1998*"}'
curl -X POST https://tu-app-url.com/api/auth/login -Headers $headers -Body $body

# 3. Visita la tienda en el navegador
# https://tu-app-url.com/tienda.html
```

---

## **PASO 6: Configurar CI/CD Automático** 🤖

**Con Railway/DigitalOcean:**
- Cada vez que hagas `git push origin main`, se desplegará automáticamente
- No necesitas hacer nada más

**Flujo:**
```powershell
# Hacer cambios locales
# ...
git add .
git commit -m "Nueva feature"
git push origin main

# ¡Automáticamente se despliega en tu servidor!
```

---

## **CHECKLIST FINAL** ✨

- [ ] Repositorio creado en GitHub
- [ ] Código enviado a GitHub
- [ ] Plataforma seleccionada (Railway/DigitalOcean/Heroku)
- [ ] App creada en la plataforma
- [ ] Database PostgreSQL configurada
- [ ] Variables de ambiente configuradas
- [ ] Deploy completado
- [ ] App funcionando en URL pública
- [ ] Login funciona (admin / Dudimeda1998*)
- [ ] Tienda carga correctamente
- [ ] Carrito funciona
- [ ] Compra funciona (con Paggo)
- [ ] Dominio personalizado configurado (opcional)

---

## **MONITOREO POST-DEPLOY** 📊

Después de publicar, revisa regularmente:

1. **Logs**: Ve a la sección de logs en tu plataforma
2. **Base de Datos**: Verifica que se está conectando
3. **Errores**: Busca cualquier error en los logs
4. **Rendimiento**: Revisa CPU y memoria
5. **Usuarios**: Monitorea las compras en el panel admin

---

## **PROBLEMAS COMUNES** 🚨

### "Cannot find module 'dotenv'"
- Railway/DigitalOcean no ejecutan `npm install` correctamente
- Solución: Asegúrate que el build command es `npm install`

### "Database connection failed"
- La `DATABASE_URL` está mal configurada
- Copia exactamente la URL que proporciona tu plataforma

### "Blank page / 404"
- Verifica que el path público es `/public`
- Revisa los logs para errores

### "JWT error"
- Tu `JWT_SECRET` no está configurado
- Debe ser una cadena de al menos 32 caracteres

---

## **NECESITAS AYUDA?** 💬

- **Railway Support**: https://railway.app/support
- **DigitalOcean Docs**: https://docs.digitalocean.com/products/app-platform/
- **Stack Overflow**: Tag `railway` o `digitalocean`

---

## **PRÓXIMAS MEJORAS** 🚀

Después de publicar:
1. Agregar más productos
2. Integrar pagos con Stripe/Paypal
3. Enviar emails de confirmación
4. Panel de analytics
5. Versión móvil mejorada
6. Soporte múltiples idiomas

---

**¡Estás a minutos de tener tu tienda en vivo! 🎉**

Elige una plataforma y comienza. Recomiendo **Railway** por su simplicidad.
