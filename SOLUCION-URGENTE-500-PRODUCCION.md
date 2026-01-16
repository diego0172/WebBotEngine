# 🚨 SOLUCIÓN URGENTE - ERROR 500 EN PRODUCCIÓN

## ❌ Error Actual
```
GET /api/commerce/demos/all - 500 Internal Server Error
GET /api/commerce/testimonios/all - 500 Internal Server Error
```

## 🎯 Causa
**Las tablas `proyectos_demo` y `testimonios` NO EXISTEN en la base de datos de producción.**

---

## ✅ SOLUCIÓN INMEDIATA (3 PASOS)

### PASO 1: Conectar al Servidor

```bash
# SSH a tu servidor DigitalOcean
ssh root@tu-servidor-ip

# O desde Droplet Console en DigitalOcean
```

### PASO 2: Ir al Directorio del Proyecto

```bash
cd /var/www/WebBotEngine
# O donde esté tu proyecto
```

### PASO 3: Ejecutar Migración

**Opción A - Automático (recomendado):**
```bash
bash ejecutar-migracion-produccion.sh
```

**Opción B - Manual:**
```bash
# Obtener DATABASE_URL de .env.production
export DATABASE_URL="tu_database_url_aqui"

# Ejecutar migración
psql "$DATABASE_URL" -f MIGRACION-PRODUCCION-RAPIDA.sql

# Reiniciar servidor
pm2 restart all
```

**Opción C - Conexión directa a BD:**
```bash
# Conectar a PostgreSQL
psql -h db-postgresql-nyc3-xxxxx.ondigitalocean.com \
     -U doadmin \
     -d defaultdb \
     -p 25060

# Dentro de psql, ejecutar:
\i MIGRACION-PRODUCCION-RAPIDA.sql
\q

# Reiniciar servidor
pm2 restart all
```

---

## 🔍 VERIFICACIÓN

### Verificar que las tablas existen:

```bash
psql "$DATABASE_URL" -c "SELECT count(*) FROM proyectos_demo;"
psql "$DATABASE_URL" -c "SELECT count(*) FROM testimonios;"
```

**Resultado esperado:**
```
 count 
-------
     4
(1 row)

 count 
-------
     6
(1 row)
```

### Verificar en el navegador:

1. Abre: `https://botenginecorp.com/admin-panel.html`
2. Click en tab "Demos" - Debe cargar 4 demos
3. Click en tab "Testimonios" - Debe cargar 6 testimonios
4. No debe haber errores en consola (F12)

---

## 🚀 SI NO TIENES ACCESO SSH

### Opción 1: DigitalOcean Web Console

1. Login en DigitalOcean
2. Ve a tu Droplet
3. Click en "Console" (arriba derecha)
4. Ejecuta los comandos del PASO 3

### Opción 2: pgAdmin / DBeaver

1. Conecta a tu base de datos PostgreSQL
2. Abre `MIGRACION-PRODUCCION-RAPIDA.sql`
3. Ejecuta todo el script
4. Luego desde SSH o console: `pm2 restart all`

### Opción 3: DigitalOcean Database UI

1. Login en DigitalOcean
2. Databases → Tu cluster PostgreSQL
3. Click "Users & Databases"
4. Usa las credenciales para conectar con psql local
5. Ejecuta el script

---

## 📋 COMANDOS RÁPIDOS

```bash
# Todo en uno
cd /var/www/WebBotEngine && \
export $(cat .env.production | grep DATABASE_URL | xargs) && \
psql "$DATABASE_URL" -f MIGRACION-PRODUCCION-RAPIDA.sql && \
pm2 restart all && \
echo "✅ MIGRACIÓN COMPLETADA"
```

---

## 🆘 SI SIGUE SIN FUNCIONAR

### 1. Verificar logs del servidor

```bash
pm2 logs --lines 50
```

Busca errores relacionados con PostgreSQL.

### 2. Verificar que el archivo de migración subió

```bash
ls -la MIGRACION-PRODUCCION-RAPIDA.sql
```

Si no existe, súbelo vía git pull:
```bash
git pull origin main
```

### 3. Verificar conexión a BD

```bash
psql "$DATABASE_URL" -c "SELECT NOW();"
```

Debe mostrar la fecha/hora actual.

---

## ⏱️ TIEMPO ESTIMADO

- **Opción A (script automático):** 30 segundos
- **Opción B (manual):** 1-2 minutos
- **Opción C (pgAdmin):** 2-3 minutos

---

## 📞 CHECKLIST POST-MIGRACIÓN

- [ ] Tablas creadas (proyectos_demo, testimonios)
- [ ] Datos de ejemplo insertados (4 demos, 6 testimonios)
- [ ] Servidor reiniciado (pm2 restart all)
- [ ] Admin panel carga sin errores
- [ ] Tab "Demos" muestra 4 proyectos
- [ ] Tab "Testimonios" muestra 6 testimonios
- [ ] No hay errores 500 en consola del navegador

---

## 🎯 COMANDO DE EMERGENCIA (COPIAR Y PEGAR)

Si tienes acceso SSH, ejecuta esto directamente:

```bash
ssh root@tu-servidor << 'EOF'
cd /var/www/WebBotEngine
git pull origin main
export $(cat .env.production | grep DATABASE_URL | xargs)
psql "$DATABASE_URL" -f MIGRACION-PRODUCCION-RAPIDA.sql
pm2 restart all
echo "✅ LISTO - Verifica: https://botenginecorp.com/admin-panel.html"
EOF
```

Reemplaza `root@tu-servidor` con tus credenciales.

---

*Última actualización: 2026-01-15*
*Prioridad: URGENTE - Producción*
