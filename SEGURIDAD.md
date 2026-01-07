# 🔒 Checklist de Seguridad - WebBotEngine

## **ANTES DE PUBLICAR EN VIVO** ⚠️

### **Base de Datos** 🛡️
- [ ] ¿Está la BD en DigitalOcean y NO en tu computadora?
- [ ] ¿Tienes backups de la BD?
- [ ] ¿La contraseña de BD es fuerte (min 20 caracteres)?
- [ ] ¿Solo el servidor puede conectarse a la BD?
- [ ] ¿Habilitaste SSL para la conexión a BD?

### **Secretos y Variables** 🔑
- [ ] `JWT_SECRET` es aleatorio y tiene 32+ caracteres
- [ ] `JWT_SECRET` NO está en `.env.production` (solo en la plataforma)
- [ ] `DATABASE_URL` NO está en el código
- [ ] `PAGGO_API_KEY` NO está en el código
- [ ] Todas las variables están SOLO en la plataforma (Railway/DigitalOcean/etc)
- [ ] El `.env.production` está en `.gitignore`
- [ ] El `.env` está en `.gitignore`

### **Código** 🐛
- [ ] No hay `console.log` con datos sensibles
- [ ] No hay contraseñas hardcodeadas
- [ ] Las APIs usan HTTPS (no HTTP)
- [ ] No hay `eval()` o código dinámico peligroso
- [ ] Las rutas de admin requieren autenticación
- [ ] Los datos sensibles se validan en backend (no solo frontend)

### **Autenticación** 🔐
- [ ] La contraseña admin es fuerte: `Dudimeda1998*`
- [ ] No hay otros usuarios admin creados por default
- [ ] Los tokens JWT expiran después de 24h
- [ ] Las contraseñas están hasheadas con bcrypt
- [ ] No hay login por URL (no `?usuario=admin&password=...`)

### **Servidor** 🌐
- [ ] HTTPS está habilitado (no HTTP)
- [ ] Helmet está configurado para seguridad
- [ ] CORS está restringido (no acepta todos los orígenes)
- [ ] Rate limiting está activado (para evitar fuerza bruta)
- [ ] Los errores NO muestran stack traces en producción
- [ ] Morgan (logging) está configurado
- [ ] Las dependencias están actualizadas

### **APIs** 📡
- [ ] Las APIs de comercio requieren JWT token
- [ ] Las mutaciones (POST/PUT/DELETE) requieren token
- [ ] Los endpoints están validados
- [ ] No hay información sensible en las respuestas
- [ ] Los números de orden NO son secuenciales (usa UUIDs)

### **Datos del Usuario** 👤
- [ ] Los emails se almacenan de forma segura
- [ ] No almacenas números de tarjeta (Paggo lo hace)
- [ ] Los datos de órdenes están encriptados (opcional pero recomendado)
- [ ] Hay política de privacidad
- [ ] Hay política de términos y condiciones

### **Pagos** 💳
- [ ] Usas Paggo (no almacenas tarjetas)
- [ ] Las claves de Paggo no están en el código
- [ ] Las transacciones se registran correctamente
- [ ] Solo se descuenta stock después de pago exitoso
- [ ] Hay logs de transacciones

### **Backups** 💾
- [ ] Tienes backups automáticos de BD (al menos diarios)
- [ ] Puedes restaurar desde un backup
- [ ] Los archivos importantes están en control de versiones (Git)
- [ ] Tienes una copia local de backup

### **Monitoreo** 📊
- [ ] Recibes alertas de errores
- [ ] Monitoreas uso de CPU/memoria
- [ ] Revisas logs regularmente
- [ ] Tienes alertas para tráfico anormal

---

## **LISTA DE CHEQUEO PRE-DEPLOY** ✅

Ejecuta esto antes de hacer el primer push:

```bash
# 1. Verificar que .gitignore existe
cat .gitignore
# Debe incluir: .env, .env.production, .env.*.local, node_modules/

# 2. Verificar que no hay secretos en Git
git log --all --full-history -S "password" -S "secret" -S "api_key"
# No debe mostrar secretos

# 3. Verificar que npm no instala dev deps en producción
cat package.json
# Solo dependencias production deben instalarse

# 4. Hacer un build test
npm start
# La app debe iniciarse sin errores

# 5. Verificar que server.js no revela información
grep -n "console.log" src/server.js | grep -v "✅\|🚀\|📁\|🌍"
# No debe haber console.log de datos sensibles
```

---

## **DESPUÉS DE PUBLICAR** 🎉

### **Primeras 24 horas:**
- [ ] Monitorea los logs cada hora
- [ ] Prueba el login
- [ ] Prueba agregar productos
- [ ] Prueba una compra completa
- [ ] Verifica que los emails se envían
- [ ] Revisa la BD para ver los datos guardados

### **Primera semana:**
- [ ] Configura alertas en la plataforma
- [ ] Configura backups automáticos
- [ ] Haz un primer backup manual
- [ ] Documenta los problemas encontrados
- [ ] Prueba la restauración desde backup

### **Mensualmente:**
- [ ] Revisa logs de errores
- [ ] Actualiza dependencias (si hay parches de seguridad)
- [ ] Verifica performance
- [ ] Comprueba que los backups funcionan
- [ ] Revisa la BD por datos anómalos

---

## **MEJORAS DE SEGURIDAD FUTURAS** 🚀

Cuando tengas más tiempo:
- [ ] Implementar 2FA (autenticación de dos factores)
- [ ] Encriptar datos sensibles en BD
- [ ] Implementar rate limiting por IP
- [ ] Agregar CAPTCHA en login
- [ ] Implementar audit logs
- [ ] Agregar validación de email
- [ ] Implementar reset de contraseña
- [ ] Agregar protección CSRF
- [ ] Implementar CSP más estricto
- [ ] Usar HTTPS Strict-Transport-Security

---

## **REPORTAR PROBLEMAS** 🚨

Si encuentras problemas de seguridad:
1. NO los compartas públicamente
2. Notifica al equipo internamente
3. Crea un ticket privado en GitHub
4. Documenta los pasos para reproducir
5. Sugiere una solución

---

## **REFERENCIAS ÚTILES** 📚

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Node.js Security Checklist: https://nodejs.org/en/docs/guides/security/
- Express.js Security Best Practices: https://expressjs.com/en/advanced/best-practice-security.html
- PostgreSQL Security: https://www.postgresql.org/docs/current/sql-syntax.html

---

**¡Seguridad primero! 🛡️**

Antes de publicar, revisa este checklist completamente.
