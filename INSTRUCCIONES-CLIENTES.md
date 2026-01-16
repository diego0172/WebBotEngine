# Instrucciones para Implementar la Gestión de Clientes

## 🚀 Pasos de Implementación

### 1. Ejecutar la Migración de Base de Datos

Necesitas crear la tabla `clientes` en tu base de datos PostgreSQL. Hay dos formas de hacerlo:

#### Opción A: Usando psql (línea de comandos)
```bash
# Conectar a tu base de datos
psql -h <host> -U <usuario> -d <nombre_base_datos> -p <puerto>

# Luego ejecutar el archivo de migración
\i migration-add-clientes.sql

# O en una sola línea:
psql -h <host> -U <usuario> -d <nombre_base_datos> -p <puerto> -f migration-add-clientes.sql
```

#### Opción B: Usando un cliente gráfico (DBeaver, pgAdmin, etc.)
1. Abre tu cliente de base de datos
2. Conéctate a tu base de datos
3. Abre el archivo `migration-add-clientes.sql`
4. Ejecuta todo el script

### 2. Verificar la Creación de la Tabla

Ejecuta este query para verificar que la tabla se creó correctamente:

```sql
SELECT * FROM clientes ORDER BY orden ASC;
```

Deberías ver 4 clientes de ejemplo ya insertados.

### 3. Reiniciar el Servidor

Una vez ejecutada la migración, reinicia tu servidor Node.js:

```bash
# Si estás usando PM2:
pm2 restart all

# Si estás corriendo en desarrollo:
# Detén el servidor (Ctrl+C) y vuelve a iniciarlo
npm start
```

### 4. Probar la Funcionalidad

#### Probar el Panel Admin:
1. Abre `https://botenginecorp.com/admin-login.html`
2. Inicia sesión con tus credenciales
3. Haz clic en la pestaña "Clientes"
4. Deberías ver los 4 clientes de ejemplo

#### Probar la Página Principal:
1. Abre `https://botenginecorp.com`
2. Baja hasta la sección "Nuestros Clientes"
3. Deberías ver los proyectos cargándose dinámicamente

### 5. Agregar tus Propios Clientes

Desde el panel admin:
1. Click en "Agregar Nuevo Cliente"
2. Completa el formulario:
   - **Nombre del Proyecto**: Nombre del cliente o proyecto
   - **Descripción**: Breve descripción del trabajo realizado
   - **URL del Sitio Web**: Link al sitio web del cliente
   - **URL de la Imagen**: Ruta a la imagen (ej: `img/mi-cliente.jpg`)
   - **Orden**: Número para ordenar (menor = aparece primero)
   - **Activo**: Marcar para mostrar en la página

3. Opcionalmente puedes subir una imagen directamente
4. Click en "Guardar Cliente"

## 📋 Funcionalidades Implementadas

✅ **Panel de Administración**
- Sección completa para gestionar clientes
- Crear, editar y eliminar proyectos
- Subir imágenes
- Ordenar proyectos
- Activar/desactivar proyectos

✅ **API REST**
- `GET /api/commerce/clientes` - Obtener clientes activos (público)
- `GET /api/commerce/clientes/all` - Obtener todos (admin)
- `POST /api/commerce/clientes` - Crear cliente (admin)
- `PUT /api/commerce/clientes/:id` - Actualizar cliente (admin)
- `DELETE /api/commerce/clientes/:id` - Eliminar cliente (admin)

✅ **Página Principal**
- Carga dinámica de clientes desde la base de datos
- Fallback elegante si no hay clientes
- Manejo de errores
- Animaciones reveal

## 🔧 Solución de Problemas

### Error: "relation 'clientes' does not exist"
**Solución**: No has ejecutado la migración. Sigue el paso 1.

### Los clientes no aparecen en la página
**Solución**: 
1. Verifica que los clientes estén marcados como "activo = true" en la base de datos
2. Abre la consola del navegador (F12) y busca errores
3. Verifica que el servidor esté corriendo

### Error 401 al crear/editar clientes
**Solución**: Asegúrate de estar autenticado en el panel admin

### Las imágenes no se ven
**Solución**:
1. Verifica que la ruta de la imagen sea correcta
2. Sube las imágenes a la carpeta `public/img/`
3. Usa rutas relativas como `img/cliente-ejemplo.jpg`

## 📝 Notas Importantes

- Las imágenes deben estar en la carpeta `public/img/` o proporcionar una URL completa
- El tamaño recomendado de imágenes es 800x600px (relación 4:3)
- Los clientes se ordenan por el campo "orden" (menor a mayor)
- Solo los clientes con "activo = true" aparecen en la página principal
- Los cambios son inmediatos, no necesitas reiniciar el servidor

## 🎨 Personalización

Si deseas cambiar el diseño de las tarjetas de clientes, edita:
- **Estilos**: `public/css/styles.css` (busca `.clientes-section`)
- **Estructura HTML**: `public/index.html` (función `cargarClientes`)
- **Panel Admin**: `public/admin-panel.html` (sección de clientes)
