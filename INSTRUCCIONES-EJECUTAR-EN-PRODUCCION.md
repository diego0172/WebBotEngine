# 🚀 Ejecutar Script en Producción - DigitalOcean

## 📋 Pasos Rápidos

### Opción 1: Desde tu Computadora (RECOMENDADO)

```bash
# Conéctate a tu base de datos
psql "postgresql://doadmin:AVNS_xxxxx@db-postgresql-nyc3-xxxxx.ondigitalocean.com:25060/defaultdb?sslmode=require"

# Una vez conectado, ejecuta:
\i ejecutar-en-produccion.sql

# O copia y pega todo el contenido del archivo
```

### Opción 2: Desde DigitalOcean Console

1. **Login a DigitalOcean:** https://cloud.digitalocean.com
2. **Databases** → Tu cluster PostgreSQL
3. **Connection Details** → **Connection String**
4. Copia la cadena de conexión

5. **En tu terminal local:**
```bash
cd "c:\Users\carlo\OneDrive\Documentos\WebBotEngine"

# Conectar (reemplaza con tu cadena de conexión)
psql "tu-connection-string-aqui"
```

6. **Dentro de psql:**
```sql
\i ejecutar-en-produccion.sql
```

### Opción 3: Copiar y Pegar Directo

1. Abre el archivo `ejecutar-en-produccion.sql`
2. Copia TODO el contenido (Ctrl+A, Ctrl+C)
3. Conéctate a tu BD con psql
4. Pega el contenido completo (Ctrl+V)
5. Enter para ejecutar

---

## 🔐 Credenciales de DigitalOcean

Busca en tu `.env.production` o en el panel de DigitalOcean:

```
Host: db-postgresql-xxxx.db.ondigitalocean.com
Port: 25060
User: doadmin
Password: AVNS_xxxxxxxxx
Database: defaultdb
SSL Mode: require
```

---

## ✅ Verificación Post-Ejecución

Después de ejecutar el script, verás algo como:

```
NOTICE:  ✅ Tablas creadas exitosamente
NOTICE:  📊 Clientes: 4
NOTICE:  📊 Demos: 4
NOTICE:  📊 Testimonios: 6
COMMIT
```

Y luego las tablas con datos:

```
 id |        nombre        | activo
----+----------------------+--------
  1 | Café Digital         | t
  2 | Tech Solutions       | t
  3 | Boutique Fashion     | t
  4 | Consultorio Médico   | t
```

---

## 🔄 Reiniciar Servidor en Producción

Después de ejecutar el script:

```bash
# Si usas PM2 en producción
pm2 restart all

# O desde DigitalOcean App Platform
# → Tu app → Settings → Force Rebuild & Deploy
```

---

## 🧪 Probar en Producción

1. Ve a: `https://botenginecorp.com/admin-panel.html`
2. Inicia sesión
3. Click en tab "Testimonios"
4. Click en tab "Demos"
5. **Debería cargar sin errores 500** ✅

---

## 🐛 Si Algo Sale Mal

### Error: "relation already exists"

**No hay problema.** El script usa `IF NOT EXISTS`, así que es seguro ejecutarlo múltiples veces.

### Error: "permission denied"

Asegúrate de estar usando el usuario `doadmin` o un usuario con permisos de CREATE TABLE.

### Error: "could not connect to server"

Verifica:
1. La cadena de conexión es correcta
2. Tu IP está en la whitelist de DigitalOcean (o usa "Allow all")
3. El puerto 25060 no está bloqueado por firewall

---

## 📞 Comando Rápido (Todo en Uno)

Si tienes `psql` instalado en Windows:

```powershell
cd "c:\Users\carlo\OneDrive\Documentos\WebBotEngine"

# Reemplaza con tus credenciales
$env:PGPASSWORD="tu_password"
psql -h db-postgresql-xxx.ondigitalocean.com -U doadmin -d defaultdb -p 25060 -f ejecutar-en-produccion.sql
```

---

## ✨ Después de Ejecutar

Tu sitio tendrá:

✅ 4 clientes de ejemplo
✅ 4 proyectos demo
✅ 6 testimonios verificados
✅ Todas las tablas con índices optimizados
✅ Triggers para actualización automática
✅ Datos listos para mostrar

**¡El error 500 desaparecerá!** 🎉

---

## 🔒 Seguridad

El script es **idempotente** (seguro ejecutar múltiples veces):
- Usa `CREATE TABLE IF NOT EXISTS`
- Usa `INSERT ... WHERE NOT EXISTS`
- No borra datos existentes
- Solo agrega lo que falta

---

## 📊 Tiempo Estimado

- Conexión: ~10 segundos
- Ejecución del script: ~5 segundos
- Total: **~15 segundos** ⚡

---

*¡Éxito! Después de ejecutar este script, tu sitio en producción estará completamente funcional.*
