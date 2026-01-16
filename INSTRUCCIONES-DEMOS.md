# Sistema de Proyectos Demo - Instrucciones de Implementación

## 🎯 Descripción

Sistema completo para gestionar y mostrar proyectos demo/ejemplo que muestran tus capacidades, incluso si no son de clientes reales. Ideal para mostrar trabajos de muestra como sitios de peluquería, restaurantes, gimnasios, etc.

## 🚀 Implementación

### 1. Ejecutar Migración de Base de Datos

```bash
# Opción A: Usando psql
psql -h <host> -U <usuario> -d <nombre_base_datos> -p <puerto> -f migration-add-demos.sql

# Opción B: En cliente gráfico (DBeaver, pgAdmin)
# Abrir y ejecutar el archivo migration-add-demos.sql
```

### 2. Verificar la Tabla

```sql
SELECT * FROM proyectos_demo ORDER BY destacado DESC, orden ASC;
```

Deberías ver 4 demos de ejemplo.

### 3. Reiniciar el Servidor

```bash
pm2 restart all
# o
npm start
```

### 4. Acceder a las Funcionalidades

#### Panel de Administración:
1. Ve a `https://botenginecorp.com/admin-login.html`
2. Inicia sesión
3. Click en la pestaña **"Demos"**
4. Gestiona tus proyectos demo

#### Página Pública de Demos:
- Visita `https://botenginecorp.com/demos.html`
- Verás una galería con filtros por categoría
- Los demos destacados aparecen primero

## 📋 Funcionalidades

### Panel de Administración

**Crear Demo:**
- Nombre del proyecto
- Descripción detallada
- URL (puede ser externa o ancla: `#demo-nombre`)
- Categoría (Peluquería, Restaurante, Tienda, etc.)
- Imagen (subir archivo o URL)
- Tecnologías usadas (opcional)
- Marcar como destacado ⭐
- Orden de visualización
- Activar/desactivar

**Editar/Eliminar:**
- Click en cualquier demo para editarlo
- Eliminar demos que ya no necesites

### Página de Demos (demos.html)

**Características:**
- Grid responsivo con tarjetas
- Filtros por categoría
- Demos destacados resaltados
- Tags de tecnologías
- Enlaces a los proyectos
- Diseño moderno y atractivo

### API REST

```javascript
GET /api/commerce/demos                      // Públicos activos
GET /api/commerce/demos/all                  // Todos (admin)
GET /api/commerce/demos/categoria/:categoria // Por categoría
POST /api/commerce/demos                     // Crear (admin)
PUT /api/commerce/demos/:id                  // Actualizar (admin)
DELETE /api/commerce/demos/:id               // Eliminar (admin)
```

## 💡 Casos de Uso

### Ejemplo 1: Peluquería
```javascript
{
  "nombre": "Peluquería Estilo Moderno",
  "descripcion": "Sistema completo de reservas en línea...",
  "url": "https://demo-peluqueria.botenginecorp.com",
  "imagen_url": "img/demo-peluqueria.jpg",
  "categoria": "Peluquería",
  "tecnologias": "React, Node.js, Sistema de Reservas",
  "destacado": true,
  "orden": 1,
  "activo": true
}
```

### Ejemplo 2: Link Interno
Si quieres que el demo redirija a una sección en tu sitio:
```javascript
{
  "url": "#demo-restaurante",
  // ... resto de campos
}
```

## 🎨 Categorías Disponibles

- Peluquería / Salón de Belleza
- Restaurante / Café
- Tienda / E-commerce
- Clínica / Consultorio Médico
- Gimnasio / Centro Deportivo
- Servicios Profesionales
- Escuela / Academia
- Bienes Raíces
- Eventos / Catering
- Taller / Automotriz
- Otro

## 📸 Imágenes

### Tamaño Recomendado
- **800x600px** o **1200x800px**
- Formato: JPG o PNG
- Peso máximo: 300KB

### Ubicación
Guarda las imágenes en `public/img/` con nombres descriptivos:
- `demo-peluqueria.jpg`
- `demo-restaurante-gourmet.jpg`
- etc.

### Imágenes de Ejemplo Incluidas (SVG)
- ✅ `demo-peluqueria.svg`
- ✅ `demo-restaurante-gourmet.svg`
- ✅ `demo-gimnasio.svg`
- ✅ `demo-dental.svg`

## 🔧 Personalización

### Agregar Nuevas Categorías
Edita `admin-panel.html` línea ~650:
```html
<option value="TuCategoria">Tu Categoría</option>
```

### Cambiar Estilos de la Galería
Edita `demos.html` en la sección `<style>`

### Modificar Grid
En `demos.html`:
```css
.demos-grid {
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  /* Cambiar 350px por el ancho mínimo deseado */
}
```

## 🎯 Diferencia entre Clientes y Demos

### 👥 **Clientes** (`clientes`)
- Proyectos de clientes reales
- Muestran trabajo completado
- Aparecen en la sección "Nuestros Clientes" de index.html

### 🧪 **Demos** (`proyectos_demo`)
- Proyectos de ejemplo/muestra
- Pueden no ser de clientes reales
- Tienen su propia galería en demos.html
- Incluyen categorías y tecnologías
- Pueden marcarse como "destacados"

## 💡 Tips de Uso

1. **Destacar los Mejores**: Marca tus mejores demos como "destacados" para que aparezcan primero

2. **URLs Creativas**: 
   - Usa URLs externas para demos hosteados
   - Usa anclas internas (#) para redireccionar a secciones
   - Usa URLs de CodePen, GitHub Pages, etc.

3. **Tecnologías**: Lista las tecnologías para mostrar tus habilidades

4. **Categorías Claras**: Usa categorías específicas para ayudar a los visitantes a encontrar lo que buscan

5. **Imágenes Atractivas**: Usa capturas de pantalla de buena calidad o mockups profesionales

## 🐛 Solución de Problemas

### Los demos no aparecen
- Verifica que `activo = true`
- Revisa la consola del navegador (F12)
- Verifica que el servidor esté corriendo

### Error al crear demo
- Asegúrate de estar autenticado
- Verifica que todos los campos requeridos estén completos

### Imágenes no se ven
- Verifica la ruta de la imagen
- Asegúrate de que el archivo existe en `public/img/`

## 📊 Estructura de la Base de Datos

```sql
proyectos_demo:
  - id (SERIAL PRIMARY KEY)
  - nombre (VARCHAR)
  - descripcion (TEXT)
  - url (VARCHAR)
  - imagen_url (VARCHAR)
  - categoria (VARCHAR)
  - tecnologias (TEXT, nullable)
  - destacado (BOOLEAN)
  - orden (INTEGER)
  - activo (BOOLEAN)
  - fecha_creacion (TIMESTAMP)
  - fecha_actualizacion (TIMESTAMP)
```

## 🎉 Beneficios

1. **Muestra tu Trabajo**: Aunque no tengas clientes, puedes mostrar lo que puedes hacer
2. **Atrae Clientes**: Los visitantes ven ejemplos concretos de tu trabajo
3. **Flexible**: Crea demos para cualquier industria
4. **Profesional**: Galería moderna con filtros y categorías
5. **Fácil Gestión**: Todo desde el panel admin

## 📝 Archivos Creados/Modificados

**Nuevos:**
- ✅ `migration-add-demos.sql`
- ✅ `public/demos.html`
- ✅ `public/img/demo-peluqueria.svg`
- ✅ `public/img/demo-restaurante-gourmet.svg`
- ✅ `public/img/demo-gimnasio.svg`
- ✅ `public/img/demo-dental.svg`

**Modificados:**
- ✅ `src/commerce-routes.js` - 6 nuevas rutas API
- ✅ `public/js/commerce-api.js` - 6 nuevos métodos
- ✅ `public/admin-panel.html` - Tab + modal + funciones
- ✅ `public/index.html` - Enlace al menú

---

¡Todo listo! Ahora puedes mostrar ejemplos de tu trabajo aunque no sean de clientes reales. 🚀
