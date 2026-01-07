# 🛍️ Guía de Uso - Panel de Admin y Tienda

## 🎯 Nuevas Características Agregadas

### 1. **Calculadora de Precios Automática** 📊

En el panel de administración, al agregar o editar un producto, encontrarás una **calculadora inteligente de precios**:

```
Costo: Q 120
Margen Deseado: 50%
├─ Ganancia Bruta: Q 60
├─ Margen Real: 50%
└─ Precio de Venta Recomendado: Q 180
```

**Cómo funciona:**
1. Ingresa el costo estimado del producto
2. Elige margen rápido (50% o 55%) o ingresa manual
3. La calculadora automáticamente:
   - Calcula la ganancia bruta
   - Muestra el margen real
   - Sugiere el precio de venta
   - Auto-llena el campo de precio

**Márgenes recomendados:**
- 50% margen = 100% de ganancia sobre costo
- 55% margen = 122% de ganancia sobre costo

### 2. **Estado de Productos** 🏷️

Cada producto ahora tiene un **estado** visible en el panel:

- **✓ Activo** (verde) - Producto disponible en la tienda
- **Inactivo** (gris) - Producto no visible pero guardado
- **Agotado** (rojo) - Sin stock

Esto se muestra con un badge en la esquina de cada tarjeta de producto.

### 3. **Seguimiento de Ventas** 📈

En el panel admin ves:

```
Stock: 50 unidades     | Ventas: 3 unidades
```

Esto muestra cuántas unidades se han vendido de cada producto.

---

## 📦 Los 3 Productos Principales

### Producto 1: **Combo Teclado y Mouse para Oficina**
- **Costo:** Q 120
- **Precio:** Q 259
- **Ganancia:** Q 139 (53%)
- **Stock Inicial:** 50 unidades
- **Categoría:** Combos

👉 **Este es tu producto principal - El más rentable**

### Producto 2: **Combo Inalámbrico Teclado y Mouse para Hogar**
- **Costo:** Q 150
- **Precio:** Q 299
- **Ganancia:** Q 149 (50%)
- **Stock Inicial:** 30 unidades
- **Categoría:** Combos

💡 **Vende mejor por ser inalámbrico**

### Producto 3: **Mouse USB Básico para Uso Diario**
- **Costo:** Q 75
- **Precio:** Q 159
- **Ganancia:** Q 84 (55%)
- **Stock Inicial:** 100 unidades
- **Categoría:** Accesorios

🎯 **Producto de entrada y complemento**

---

## 🚀 Cómo Cargar los Productos

### Opción 1: Automáticamente (Recomendado)

```bash
node seed-productos.js
```

Esto carga automáticamente los 3 productos con los precios y costos correctos.

### Opción 2: Manual en Panel Admin

1. Ve a **Panel Admin** → **Tienda**
2. Haz clic en **"Agregar Nuevo Producto"**
3. Completa los datos usando la calculadora:
   - Nombre del producto
   - Descripción
   - **Costo estimado** (Q)
   - Margen deseado (50% o 55%)
   - La calculadora sugiere el precio
   - Ajusta si necesitas
   - Selecciona estado (Activo)
   - Carga imagen si tienes
   - Categoría

---

## 💰 Cómo Usar la Calculadora

### Ejemplo Práctico:

**Quieres vender el Combo 1:**

```
1. Ingresa Costo: Q 120
2. Haz clic en botón "50%"
3. La calculadora te muestra:
   - Ganancia: Q 60
   - Margen Real: 50%
   - Precio Recomendado: Q 180
4. El campo de precio se auto-llena a Q 180
5. Guarda el producto
```

### ¿Por qué estos precios?

| Producto | Costo | Precio | Ganancia | Margen | Psicología |
|----------|-------|--------|----------|--------|-----------|
| Combo 1 | Q 120 | Q 259 | Q 139 | 53% | Debajo de Q 300 - Accesible |
| Combo 2 | Q 150 | Q 299 | Q 149 | 50% | Justo antes de Q 300 |
| Mouse | Q 75 | Q 159 | Q 84 | 55% | Margen más alto |

---

## 📊 Panel de Control de Productos

En el panel admin verás cada producto con:

```
┌─ Combo Teclado y Mouse para Oficina ──────────────────┐
│ Status: ✓ Activo                                       │
│                                                         │
│ Precio Venta: Q 259  |  Costo: Q 120                  │
│ Stock: 50 unidades   |  Ventas: 0 unidades            │
│                                                         │
│ [Editar] [Eliminar]                                    │
└────────────────────────────────────────────────────────┘
```

---

## ✅ Regla Importante

**No compres stock inicial hasta validar demanda:**

1. Publica con stock inicial bajo (20-50 unidades)
2. Espera a vender mínimo 3 unidades
3. Si se venden, recarga stock con confianza
4. Si no se venden, ajusta precio o marketing

---

## 🎁 Promesa en la Tienda

Muestra esto junto a los precios:

```
✓ Entrega en Ciudad de Guatemala de 24 a 72 horas
✓ Pago contra entrega disponible
✓ Atención directa por WhatsApp
```

---

## 🔧 Campos Disponibles en el Producto

| Campo | Tipo | Obligatorio | Nota |
|-------|------|-------------|------|
| Nombre | Texto | ✅ | Máximo 255 caracteres |
| Descripción | Texto largo | ✅ | SEO importante |
| Costo | Número | ✅ | Para calculadora |
| Precio | Número | ✅ | Calcula con la herramienta |
| Stock | Número | ✅ | Unidades disponibles |
| Estado | Select | ✅ | Activo/Inactivo/Agotado |
| Categoría | Texto | ✅ | Agrupar productos |
| Imagen | Archivo | ✅ | Debe ser imagen |

---

## 📈 Próximos Pasos Recomendados

1. ✅ Carga los 3 productos
2. ✅ Configura imágenes si tienes
3. ✅ Publica en redes sociales
4. ✅ Espera primeras ventas
5. ✅ Valida demanda
6. ✅ Reajusta precios si es necesario
7. ✅ Agrega más productos después de validar

---

**¡Tu tienda está lista! 🚀**
