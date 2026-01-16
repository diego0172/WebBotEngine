# � Solución Rápida: "No se ve el código demo"

## ✅ SOLUCIÓN APLICADA

### Estado Actual:
- ✅ Servidor corriendo en puerto 3000
- ✅ **Demos ahora visibles con datos de ejemplo**
- ⚠️ Conexión a base de datos pendiente

### ¿Qué se hizo?
Se agregó un **fallback con datos de ejemplo** en `demos.html` para que los demos se vean incluso si la base de datos no está conectada.

---

## 🎯 VERIFICACIÓN INMEDIATA

### Abre tu navegador:

```
http://localhost:3000/demos.html
```

**Deberías ver:**
- ✅ 4 proyectos demo
- ✅ Botones de filtro (Todos, Peluquería, Restaurante, etc.)
- ✅ 2 demos marcados como "Destacado" ⭐
- ✅ Imágenes SVG coloridas

---

## 🔄 PRÓXIMOS PASOS (Conectar Base de Datos Real)

### 1. Ejecutar Migraciones

Primero, necesitas ejecutar las migraciones en tu base de datos de producción:

```bash
# Conectar a DigitalOcean PostgreSQL
psql -h <tu-host>.db.ondigitalocean.com -U doadmin -d defaultdb -p 25060

# Una vez conectado, ejecutar:
\i migration-add-demos.sql
\i migration-add-testimonios.sql

# Verificar
SELECT * FROM proyectos_demo;
SELECT * FROM testimonios;
```

---

### 2. Verificar Configuración .env.production

El error que apareció:
```
Error: SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string
```

Indica que hay un problema con la contraseña de la base de datos.

**Verifica que `.env.production` tenga el formato correcto:**

```env
DATABASE_URL=postgresql://usuario:contraseña@host:25060/database?sslmode=require
```

**⚠️ IMPORTANTE:** 
- La contraseña NO debe tener comillas
- NO debe tener espacios
- Debe estar en una sola línea

**Ejemplo CORRECTO:**
```env
DATABASE_URL=postgresql://doadmin:AVNS_abc123xyz@db-prod-do-user.db.ondigitalocean.com:25060/defaultdb?sslmode=require
```

**Ejemplo INCORRECTO:**
```env
DATABASE_URL=postgresql://doadmin:"AVNS_abc123xyz"@db-prod...  ❌
DATABASE_URL=postgresql://doadmin: AVNS_abc123xyz @db-prod... ❌
```

---

### 3. Reiniciar el Servidor

Una vez corregido `.env.production`:

```bash
# Opción A: Con PM2 (recomendado para producción)
pm2 restart all

# Opción B: Con npm (desarrollo local)
npm start
```

---

## 🧪 TEST DE CONEXIÓN

### Test 1: Verificar que el servidor corre
```bash
# En PowerShell
curl http://localhost:3000
```

**Esperado:** HTML del sitio

### Test 2: Verificar API de demos
```bash
curl http://localhost:3000/api/commerce/demos
```

**Esperado:** Array JSON con demos

### Test 3: Desde el navegador

Abre la consola (F12) y ejecuta:
```javascript
fetch('/api/commerce/demos')
  .then(r => r.json())
  .then(data => console.log('✅ Demos:', data))
  .catch(err => console.error('❌ Error:', err));
```

---

## 📊 ESTADO ACTUAL vs OBJETIVO

### ✅ Funciona AHORA (con fallback):
- Página `demos.html` se ve correctamente
- 4 demos de ejemplo visibles
- Filtros por categoría funcionan
- Diseño responsive

### 🎯 OBJETIVO (con BD conectada):
- Datos desde PostgreSQL
- Gestión desde panel admin
- Agregar/editar/eliminar demos
- Datos persistentes

---

## 🛠️ SOLUCIÓN PASO A PASO (Si BD sigue sin conectar)

### Opción 1: Usar PostgreSQL Local (Desarrollo)

```bash
# Instalar PostgreSQL localmente
# Descargar de: https://www.postgresql.org/download/windows/

# Crear base de datos local
createdb webbot

# Conectar
psql -d webbot

# Ejecutar migraciones
\i migration-add-demos.sql
\i migration-add-testimonios.sql
\i migration-add-clientes.sql

# Actualizar .env (crear si no existe)
DATABASE_URL=postgresql://postgres:tu_password@localhost:5432/webbot
```

---

### Opción 2: Verificar Credenciales de DigitalOcean

1. **Login en DigitalOcean**
2. **Databases** → Tu cluster PostgreSQL
3. **Connection Details**
4. Copiar el **Connection String**
5. Pegar en `.env.production`

---

## 🎯 RESUMEN RÁPIDO

### ✅ Lo que YA funciona:
- Servidor corriendo
- Demos visibles (con datos de ejemplo)
- Interfaz completa

### ⏳ Lo que falta:
- Conectar a base de datos real
- Ejecutar migraciones
- Habilitar panel admin

### 🚀 Acción inmediata:
1. **Abre:** `http://localhost:3000/demos.html`
2. **Verifica:** Que se ven los 4 demos
3. **Si funciona:** Continúa con conexión a BD
4. **Si no:** Revisa la consola del navegador (F12)

---

## 📞 SOPORTE ADICIONAL

Si después de estos pasos los demos aún no se ven:

1. **Captura de pantalla** de la consola del navegador (F12)
2. **Logs del servidor**: Copia el output de `npm start`
3. **Contenido de .env.production** (SIN la contraseña real)

---

*Última actualización: 15 de enero de 2026*
*Solución temporal aplicada: Datos de ejemplo como fallback*

## Posibles Causas y Soluciones

### 1. ❌ Migración de Base de Datos No Ejecutada

**Síntoma:** Al abrir `demos.html`, no se cargan proyectos

**Causa:** La tabla `proyectos_demo` no existe en PostgreSQL

**Solución:**
```bash
# Conectar a la base de datos
psql -h <host> -U <usuario> -d <nombre_base_datos> -p <puerto>

# Ejecutar la migración
\i migration-add-demos.sql

# O desde línea de comandos directamente:
psql -h <host> -U <usuario> -d <db> -f migration-add-demos.sql
```

**Verificar que funcionó:**
```sql
SELECT * FROM proyectos_demo;
```

Deberías ver 4 demos de ejemplo.

---

### 2. 🔴 Servidor No Está Corriendo

**Síntoma:** Error de conexión en la consola del navegador (F12)

**Causa:** El servidor Node.js no está activo

**Solución:**
```bash
# Opción A: Si usas PM2
pm2 list
pm2 restart all

# Opción B: Si usas npm directamente
cd c:\Users\carlo\OneDrive\Documentos\WebBotEngine
npm start
```

---

### 3. 🌐 Problema de Rutas API

**Síntoma:** Error 404 en `/api/commerce/demos`

**Causa:** Las rutas no están registradas en el servidor

**Solución:**

Verifica que `src/commerce-routes.js` esté importado en `src/server.js`:

```javascript
import commerceRoutes from './commerce-routes.js';
app.use('/api/commerce', commerceRoutes);
```

Reinicia el servidor después de verificar.

---

### 4. 📁 Archivo demos.html No Accesible

**Síntoma:** Error 404 al navegar a `/demos.html`

**Causa:** El servidor no está sirviendo archivos estáticos correctamente

**Solución:**

Verifica en `src/server.js`:
```javascript
app.use(express.static('public'));
```

---

## 🔧 Pasos de Diagnóstico

### Paso 1: Abrir la Consola del Navegador

1. Abre Chrome/Firefox
2. Navega a `http://localhost:3000/demos.html` (o tu URL)
3. Presiona **F12**
4. Ve a la pestaña **Console**
5. Busca errores en rojo

**Errores comunes:**

| Error | Causa | Solución |
|-------|-------|----------|
| `GET /api/commerce/demos 404` | Rutas no registradas | Verificar commerce-routes.js |
| `Failed to fetch` | Servidor apagado | Iniciar servidor |
| `Cannot read property 'map'` | Sin datos | Ejecutar migración |
| `CORS error` | Problema de permisos | Verificar CORS en server.js |

---

### Paso 2: Verificar Network Tab

1. En DevTools (F12), ve a **Network**
2. Recarga la página (Ctrl+R)
3. Busca la petición a `/api/commerce/demos`

**Estado esperado:** 200 OK con array de demos

**Si ves:**
- **404:** Rutas no configuradas
- **500:** Error en el servidor (revisar logs)
- **Failed:** Servidor no corre

---

### Paso 3: Verificar Logs del Servidor

```bash
# Si usas PM2
pm2 logs

# Si usas npm start
# Los logs aparecen en la consola donde ejecutaste npm start
```

Busca errores como:
- `Error obteniendo demos`
- `relation "proyectos_demo" does not exist`
- `ECONNREFUSED`

---

## ✅ Solución Rápida (Paso a Paso)

### 1. Ejecutar Migración
```bash
psql -h localhost -U postgres -d webbot -f migration-add-demos.sql
```

### 2. Verificar Datos
```sql
SELECT nombre, categoria, activo FROM proyectos_demo;
```

### 3. Reiniciar Servidor
```bash
pm2 restart all
# o
npm start
```

### 4. Verificar en Navegador
1. Abre `http://localhost:3000/demos.html`
2. Deberías ver 4 demos:
   - Peluquería Estilo Moderno ⭐
   - Restaurante Gourmet ⭐
   - Gimnasio Fitness Pro
   - Consultorio Dental

---

## 🧪 Test Manual

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Test 1: Verificar que commerceAPI existe
console.log(commerceAPI);

// Test 2: Intentar cargar demos manualmente
commerceAPI.getDemos()
  .then(demos => console.log('Demos:', demos))
  .catch(err => console.error('Error:', err));
```

**Resultado esperado:**
```javascript
Demos: [
  {
    id: 1,
    nombre: "Peluquería Estilo Moderno",
    categoria: "Peluquería",
    destacado: true,
    // ... más campos
  },
  // ... más demos
]
```

---

## 🔴 Si Nada Funciona

### Opción 1: Recrear Tabla Manualmente

```sql
-- Conectar a la base de datos
psql -h localhost -U postgres -d webbot

-- Eliminar tabla si existe (¡CUIDADO!)
DROP TABLE IF EXISTS proyectos_demo CASCADE;

-- Copiar y pegar todo el contenido de migration-add-demos.sql
-- Ejecutar línea por línea
```

### Opción 2: Verificar Variables de Entorno

Verifica que `.env` tenga:
```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_db
PORT=3000
```

### Opción 3: Contactar Soporte

Si después de todos estos pasos sigue sin funcionar, proporciona:

1. **Logs del servidor:** Salida de `pm2 logs` o consola
2. **Errores del navegador:** Captura de la consola (F12)
3. **Versión de Node:** `node --version`
4. **Versión de PostgreSQL:** `psql --version`

---

## 📞 Checklist Rápido

- [ ] Migración ejecutada: `SELECT * FROM proyectos_demo`
- [ ] Servidor corriendo: `pm2 list` o proceso activo
- [ ] Archivo existe: `c:\...\public\demos.html`
- [ ] Sin errores en consola del navegador (F12)
- [ ] Petición API retorna 200: Network tab en DevTools
- [ ] Datos visibles en la página

---

## 🎯 Resultado Esperado

Después de aplicar las soluciones, deberías ver:

**En `/demos.html`:**
- Botones de filtro (Todos, Peluquería, Restaurante, etc.)
- 4 tarjetas de demos con imágenes SVG
- 2 marcados como "Destacado" (⭐)
- Botón "Ver Demo" en cada tarjeta

**En el panel admin:**
- Pestaña "Demos" funcional
- Lista de 4 demos
- Botón "Agregar Demo"

---

*Fecha: 15 de enero de 2026*
