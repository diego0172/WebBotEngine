# 🚀 Guía de Publicación en Vivo - WebBotEngine

## **OPCIÓN 1: DigitalOcean App Platform (RECOMENDADO)**

### Paso 1: Preparar el Repositorio
```bash
# 1. Inicializar git si no lo has hecho
git init
git add .
git commit -m "Initial commit: WebBotEngine v1.0"

# 2. Crear repositorio en GitHub
# - Ve a https://github.com/new
# - Crea un nuevo repositorio público "botenginecorp"
# - Sigue las instrucciones para push

git remote add origin https://github.com/tu-usuario/botenginecorp.git
git branch -M main
git push -u origin main
```

### Paso 2: Crear App en DigitalOcean
1. Ve a https://cloud.digitalocean.com/apps
2. Haz clic en "Create App"
3. Selecciona "GitHub" como origen
4. Conecta tu cuenta GitHub (autoriza DigitalOcean)
5. Selecciona el repositorio `botenginecorp`
6. Rama: `main`

### Paso 3: Configurar la App
1. Nombre: `botenginecorp`
2. En "Resource" selecciona:
   - **Service**: Web
   - **Build**: Automatic
   - **Run Command**: `npm start`
   - **Port**: 3000

3. En "Environment Variables" agrega:
```
NODE_ENV=production
JWT_SECRET=tu-jwt-secret-super-seguro-aqui
PAGGO_API_KEY=tu-api-key-paggo
DATABASE_URL=postgresql://usuario:password@host:puerto/botenginecorp
```

### Paso 4: Crear Base de Datos
1. En DigitalOcean > Databases
2. Crea una nueva PostgreSQL database
3. Copia la connection string y pégala en `DATABASE_URL`

### Paso 5: Deploy
1. Revisa el .do/app.yaml
2. Haz clic en "Deploy"
3. ¡Espera a que se compile e inicie!

---

## **OPCIÓN 2: Railway (MÁS FÁCIL AÚN)**

### Paso 1: Preparar el Repositorio
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/botenginecorp.git
git push -u origin main
```

### Paso 2: Crear Cuenta en Railway
1. Ve a https://railway.app
2. Haz clic en "Start a Project"
3. Selecciona "Deploy from GitHub repo"

### Paso 3: Conectar GitHub
1. Autoriza Railway para acceder a GitHub
2. Selecciona tu repositorio `botenginecorp`
3. Railway detectará automáticamente que es Node.js

### Paso 4: Agregar Base de Datos
1. En el panel de Railway, haz clic en "Add Service"
2. Selecciona "PostgreSQL"
3. Las variables de ambiente se configuran automáticamente

### Paso 5: Variables de Ambiente
En Railway > Variables:
```
NODE_ENV=production
JWT_SECRET=tu-jwt-secret-super-seguro-aqui
PAGGO_API_KEY=tu-api-key-paggo
DATABASE_URL=postgresql://...  (se genera automáticamente)
```

### Paso 6: Deploy
1. Haz clic en "Deploy"
2. ¡Listo! Tu app estará en vivo en minutos

---

## **OPCIÓN 3: Heroku (Alternativa)**

### Paso 1: Instalar Heroku CLI
```bash
# Windows
# Descarga de: https://devcenter.heroku.com/articles/heroku-cli

heroku login
```

### Paso 2: Preparar el Repo
```bash
git init
git add .
git commit -m "Initial commit"
```

### Paso 3: Crear App en Heroku
```bash
heroku create botenginecorp
heroku addons:create heroku-postgresql:hobby-dev
```

### Paso 4: Configurar Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=tu-jwt-secret-super-seguro
heroku config:set PAGGO_API_KEY=tu-api-key-paggo
```

### Paso 5: Deploy
```bash
git push heroku main
```

---

## **VERIFICACIÓN POST-DEPLOYMENT**

Después de desplegar, verifica:

```bash
# 1. Visita tu app
curl https://botenginecorp.com

# 2. Verifica la BD está conectada
curl https://botenginecorp.com/api/health

# 3. Prueba el login
curl -X POST https://botenginecorp.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Dudimeda1998*"}'
```

---

## **CONFIGURAR DOMINIO PERSONALIZADO**

### Con DigitalOcean:
1. Ve a tu App > Settings > Domains
2. Haz clic en "Add Domain"
3. Ingresa tu dominio (ej: botenginecorp.com)
4. Cambia los nameservers en tu registrador

### Con Railway/Heroku:
Similar, agrégalo en Settings > Domains

---

## **VARIABLES DE AMBIENTE PRODUCCIÓN**

**IMPORTANTE**: Cambiar antes de ir a vivo:
- ✅ JWT_SECRET: Una cadena larga y aleatoria (32+ caracteres)
- ✅ DATABASE_URL: Tu conexión PostgreSQL de DigitalOcean
- ✅ PAGGO_API_KEY: Tu clave de API de Paggo (si usas pagos)
- ✅ NODE_ENV: Siempre "production"

---

## **MONITOREO**

Después de publicar:
1. Revisa los logs en tiempo real
2. Verifica alertas de CPU/memoria
3. Prueba que los pagos funcionen
4. Revisa la BD desde el panel

---

## **PRÓXIMOS PASOS**

1. ✅ Crear repositorio en GitHub
2. ✅ Escoger plataforma de hosting
3. ✅ Configurar variables de ambiente
4. ✅ Deploy
5. ✅ Verificar que todo funciona
6. ✅ Configurar dominio personalizado
7. ✅ Monitorear en tiempo real

¿Cuál prefieres? **DigitalOcean**, **Railway** o **Heroku**?
