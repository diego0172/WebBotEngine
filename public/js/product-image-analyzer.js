/**
 * DEMO: Analizador de Productos por Imagen
 * Carga una foto, el backend interpreta la foto y devuelve info del producto
 * 
 * Características:
 * - OCR y reconocimiento de productos
 * - Detección de marcas y precios
 * - Análisis de códigos de barras
 * - Integración con chatbot
 */

class ProductImageAnalyzer {
    constructor() {
        this.isProcessing = false;
        this.uploadedImage = null;
        this.analysisResult = null;
        this.init();
    }

    init() {
        console.log('🖼️ Product Image Analyzer inicializado');
        this.createUI();
    }

    /**
     * Crea la interfaz visual para análisis de imágenes
     */
    createUI() {
        const container = document.createElement('div');
        container.id = 'product-analyzer-widget';
        container.innerHTML = `
        <div id="analyzer-button" style="
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, #f59e0b, #f97316);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 6px 24px rgba(245, 158, 11, 0.6);
            transition: all 0.3s ease;
            border: 3px solid rgba(255, 255, 255, 0.3);
            z-index: 99998;
            font-size: 24px;
            animation: float 3s ease-in-out infinite;
        " title="Analizar foto de producto">
            📷
        </div>

        <!-- Modal de análisis -->
        <div id="analyzer-modal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 99999;
            backdrop-filter: blur(4px);
        ">
            <div style="
                background: white;
                border-radius: 16px;
                padding: 32px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h2 style="margin: 0; color: #1f2937; font-size: 20px;">
                        📷 Analizador de Productos
                    </h2>
                    <button id="close-analyzer" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #6b7280;
                    ">×</button>
                </div>

                <!-- Área de carga de imagen -->
                <div id="upload-area" style="
                    border: 2px dashed #d1d5db;
                    border-radius: 12px;
                    padding: 40px 20px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: #f9fafb;
                    margin-bottom: 24px;
                " onmouseover="this.style.borderColor='#3b82f6'; this.style.background='#eff6ff';" 
                   onmouseout="this.style.borderColor='#d1d5db'; this.style.background='#f9fafb';">
                    <div style="font-size: 48px; margin-bottom: 12px;">📸</div>
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">
                        <strong>Haz clic aquí</strong> o arrastra una foto de producto
                    </p>
                    <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 12px;">
                        PNG, JPG o GIF - Máximo 10MB
                    </p>
                    <input id="image-input" type="file" accept="image/*" style="display: none;">
                </div>

                <!-- Vista previa de imagen -->
                <div id="image-preview-container" style="display: none; margin-bottom: 24px;">
                    <img id="image-preview" src="" style="
                        width: 100%;
                        border-radius: 12px;
                        max-height: 300px;
                        object-fit: cover;
                    ">
                </div>

                <!-- Resultados del análisis -->
                <div id="analysis-results" style="display: none; background: #f3f4f6; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px;">✅ Análisis Completado</h3>
                    
                    <!-- Nombre del producto -->
                    <div style="margin-bottom: 16px;">
                        <h4 style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; text-transform: uppercase;">Producto</h4>
                        <p id="result-producto" style="margin: 0; color: #1f2937; font-weight: 500;"></p>
                    </div>

                    <!-- Descripción -->
                    <div style="margin-bottom: 16px;">
                        <h4 style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; text-transform: uppercase;">Descripción</h4>
                        <p id="result-descripcion" style="margin: 0; color: #1f2937; line-height: 1.5; font-size: 14px;"></p>
                    </div>

                    <!-- Marcas detectadas -->
                    <div style="margin-bottom: 16px;">
                        <h4 style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; text-transform: uppercase;">Marcas</h4>
                        <div id="result-marcas" style="display: flex; gap: 8px; flex-wrap: wrap;"></div>
                    </div>

                    <!-- Precio visible -->
                    <div style="margin-bottom: 16px;">
                        <h4 style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; text-transform: uppercase;">Precio Visible</h4>
                        <p id="result-precio" style="margin: 0; color: #1f2937; font-weight: 500;"></p>
                    </div>

                    <!-- Código de barras -->
                    <div style="margin-bottom: 16px;">
                        <h4 style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; text-transform: uppercase;">Código de Barras</h4>
                        <p id="result-codigo" style="margin: 0; color: #1f2937; font-family: monospace; font-weight: 500;"></p>
                    </div>

                    <!-- Características -->
                    <div style="margin-bottom: 16px;">
                        <h4 style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; text-transform: uppercase;">Características</h4>
                        <ul id="result-caracteristicas" style="margin: 0; padding-left: 20px; color: #1f2937;"></ul>
                    </div>

                    <!-- Recomendaciones -->
                    <div style="margin-bottom: 16px;">
                        <h4 style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; text-transform: uppercase;">Recomendaciones</h4>
                        <p id="result-recomendaciones" style="margin: 0; color: #1f2937; line-height: 1.5; font-size: 14px;"></p>
                    </div>

                    <!-- Confianza -->
                    <div style="padding: 12px; background: white; border-radius: 8px;">
                        <p style="margin: 0; color: #6b7280; font-size: 12px;">
                            <strong>Nivel de Confianza:</strong> 
                            <span id="result-confianza" style="color: #10b981; font-weight: bold;"></span>
                        </p>
                    </div>
                </div>

                <!-- Indicador de carga -->
                <div id="loading-indicator" style="display: none; text-align: center; padding: 40px 20px;">
                    <div style="
                        width: 48px;
                        height: 48px;
                        border: 4px solid #e5e7eb;
                        border-top-color: #3b82f6;
                        border-radius: 50%;
                        margin: 0 auto 16px;
                        animation: spin 1s linear infinite;
                    "></div>
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Analizando imagen...</p>
                </div>

                <!-- Botones -->
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button id="reset-analyzer" style="
                        padding: 10px 20px;
                        border: 1px solid #d1d5db;
                        border-radius: 8px;
                        background: white;
                        color: #6b7280;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                        display: none;
                    ">Nueva foto</button>
                    <button id="add-to-cart" style="
                        padding: 10px 20px;
                        border: none;
                        border-radius: 8px;
                        background: linear-gradient(135deg, #10b981, #059669);
                        color: white;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                        display: none;
                    ">Agregar al carrito</button>
                </div>
            </div>
        </div>

        <style>
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        </style>
        `;

        document.body.appendChild(container);
        this.setupEventListeners();
    }

    setupEventListeners() {
        const analyzerBtn = document.getElementById('analyzer-button');
        const closeBtn = document.getElementById('close-analyzer');
        const modal = document.getElementById('analyzer-modal');
        const uploadArea = document.getElementById('upload-area');
        const imageInput = document.getElementById('image-input');
        const resetBtn = document.getElementById('reset-analyzer');
        const addToCartBtn = document.getElementById('add-to-cart');

        // Abrir modal
        analyzerBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });

        // Cerrar modal
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            this.reset();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                this.reset();
            }
        });

        // Upload de imagen
        uploadArea.addEventListener('click', () => imageInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#3b82f6';
            uploadArea.style.background = '#eff6ff';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#d1d5db';
            uploadArea.style.background = '#f9fafb';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleImageUpload(files[0]);
            }
        });

        imageInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleImageUpload(e.target.files[0]);
            }
        });

        // Reset
        resetBtn.addEventListener('click', () => this.reset());

        // Agregar al carrito
        addToCartBtn.addEventListener('click', () => this.addToCart());
    }

    /**
     * Maneja el upload de la imagen
     */
    async handleImageUpload(file) {
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona una imagen válida');
            return;
        }

        // Mostrar vista previa
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('image-preview');
            preview.src = e.target.result;
            document.getElementById('image-preview-container').style.display = 'block';
        };
        reader.readAsDataURL(file);

        // Analizar imagen
        await this.analyzeImage(file);
    }

    /**
     * Envía la imagen al backend para análisis
     */
    async analyzeImage(file) {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        document.getElementById('loading-indicator').style.display = 'block';
        document.getElementById('analysis-results').style.display = 'none';

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('/api/analyze-product-image', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al analizar la imagen');
            }

            this.displayResults(data.analysis);
            this.analysisResult = data.analysis;

        } catch (error) {
            console.error('Error:', error);
            alert('Error al analizar la imagen: ' + error.message);
        } finally {
            this.isProcessing = false;
            document.getElementById('loading-indicator').style.display = 'none';
        }
    }

    /**
     * Muestra los resultados del análisis
     */
    displayResults(analysis) {
        document.getElementById('analysis-results').style.display = 'block';
        document.getElementById('reset-analyzer').style.display = 'inline-block';
        document.getElementById('add-to-cart').style.display = 'inline-block';

        // Producto
        document.getElementById('result-producto').textContent = 
            analysis.producto_nombre || 'No detectado';

        // Descripción
        document.getElementById('result-descripcion').textContent = 
            analysis.descripcion || 'No disponible';

        // Marcas
        const marcasDiv = document.getElementById('result-marcas');
        marcasDiv.innerHTML = '';
        if (analysis.marcas_detectadas && Array.isArray(analysis.marcas_detectadas)) {
            analysis.marcas_detectadas.forEach(marca => {
                const badge = document.createElement('span');
                badge.textContent = marca;
                badge.style.cssText = `
                    display: inline-block;
                    background: #dbeafe;
                    color: #1e40af;
                    padding: 4px 12px;
                    border-radius: 16px;
                    font-size: 12px;
                    font-weight: 500;
                `;
                marcasDiv.appendChild(badge);
            });
        } else {
            marcasDiv.innerHTML = '<span style="color: #9ca3af;">No detectadas</span>';
        }

        // Precio
        document.getElementById('result-precio').textContent = 
            analysis.precio_visible || 'No visible';

        // Código de barras
        document.getElementById('result-codigo').textContent = 
            analysis.codigo_barras || 'No detectado';

        // Características
        const caracList = document.getElementById('result-caracteristicas');
        caracList.innerHTML = '';
        if (analysis.caracteristicas && Array.isArray(analysis.caracteristicas)) {
            analysis.caracteristicas.forEach(carac => {
                const li = document.createElement('li');
                li.textContent = carac;
                caracList.appendChild(li);
            });
        } else {
            caracList.innerHTML = '<li style="color: #9ca3af;">No disponibles</li>';
        }

        // Recomendaciones
        document.getElementById('result-recomendaciones').textContent = 
            analysis.recomendaciones || 'No disponibles';

        // Confianza
        const confianzaEl = document.getElementById('result-confianza');
        confianzaEl.textContent = (analysis.confianza || 'media').toUpperCase();
        
        // Color según confianza
        const confianzaColors = {
            'alta': '#10b981',
            'media': '#f59e0b',
            'baja': '#ef4444'
        };
        confianzaEl.style.color = confianzaColors[analysis.confianza?.toLowerCase()] || '#6b7280';
    }

    /**
     * Agrega el producto al carrito (demo)
     */
    addToCart() {
        if (!this.analysisResult) return;

        const producto = {
            nombre: this.analysisResult.producto_nombre,
            descripcion: this.analysisResult.descripcion,
            precio: this.analysisResult.precio_visible,
            imagen: document.getElementById('image-preview').src,
            timestamp: new Date().toISOString()
        };

        // Guardar en localStorage
        let carrito = JSON.parse(localStorage.getItem('carrito-analizado') || '[]');
        carrito.push(producto);
        localStorage.setItem('carrito-analizado', JSON.stringify(carrito));

        alert('✅ Producto agregado al carrito:\n\n' + producto.nombre);
        this.reset();
    }

    /**
     * Reinicia el analizador
     */
    reset() {
        document.getElementById('image-input').value = '';
        document.getElementById('image-preview-container').style.display = 'none';
        document.getElementById('analysis-results').style.display = 'none';
        document.getElementById('reset-analyzer').style.display = 'none';
        document.getElementById('add-to-cart').style.display = 'none';
        this.uploadedImage = null;
        this.analysisResult = null;
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.productAnalyzer = new ProductImageAnalyzer();
    });
} else {
    window.productAnalyzer = new ProductImageAnalyzer();
}
