# Instrucciones para Imágenes de Clientes

## Imágenes Requeridas

Necesitas agregar las siguientes imágenes en esta carpeta (`public/img/`):

1. **cliente-restaurante.jpg** - Preview de un sitio web de restaurante
2. **cliente-tienda.jpg** - Preview de una tienda en línea
3. **cliente-servicios.jpg** - Preview de sitio de servicios profesionales
4. **cliente-medico.jpg** - Preview de sitio médico/clínica

## Especificaciones Recomendadas

- **Tamaño:** 800x600 píxeles (relación 4:3)
- **Formato:** JPG o PNG
- **Peso:** Máximo 200KB por imagen (optimizar para web)
- **Contenido:** Capturas de pantalla de sitios web reales o mockups

## Cómo Obtener las Imágenes

### Opción 1: Capturas de Pantalla de Proyectos Reales
Si ya tienes proyectos anteriores, toma capturas de pantalla de los sitios web.

### Opción 2: Crear Mockups Temporales
Puedes usar herramientas como:
- **Figma** - Para crear diseños rápidos
- **Canva** - Plantillas de sitios web
- **Unsplash/Pexels** - Buscar "website mockup" o "web design"

### Opción 3: Usar Imágenes de Ejemplo Temporal
Puedes usar sitios como:
- https://placeholder.com - Generar placeholders
- https://picsum.photos - Imágenes aleatorias

## Modificar los Enlaces

Una vez tengas imágenes reales, recuerda actualizar también los enlaces en `index.html`:

```html
<!-- Busca estas líneas en index.html y actualiza los href -->
<a href="https://example.com/restaurante" target="_blank">
<a href="https://example.com/tienda" target="_blank">
<a href="https://example.com/consultoria" target="_blank">
<a href="https://example.com/clinica" target="_blank">
```

Reemplaza `https://example.com/...` con las URLs reales de tus proyectos.

## Nota Importante

Si no tienes proyectos reales todavía, puedes:
1. Usar la misma URL de tu sitio BotEngine para todas
2. Crear proyectos demo ficticios
3. Ocultar la sección temporalmente hasta tener contenido real
