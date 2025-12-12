// Demo Generator - Automatic Chatbot Demo Creator
class DemoGenerator {
    constructor() {
        this.demoData = null;
        this.messages = [];
        this.currentIndex = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.timeoutId = null;
        this.chatbot = null;
        this.speeds = {
            slow: 3000,
            normal: 2000,
            fast: 1000
        };
        
        this.init();
    }

    init() {
        this.setupFormEvents();
        this.setupProductManagement();
        this.setupDemoControls();
    }

    setupFormEvents() {
        const form = document.getElementById('demoForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateDemo();
        });
    }

    setupProductManagement() {
        const addBtn = document.getElementById('addProductBtn');
        const productsList = document.getElementById('productsList');

        addBtn.addEventListener('click', () => {
            const currentCount = productsList.children.length;
            if (currentCount >= 8) {
                this.showNotification('Máximo 8 productos/servicios', 'warning');
                return;
            }

            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <input type="text" placeholder="Producto/Servicio ${currentCount + 1}" maxlength="50" required>
                <button type="button" class="btn-remove">
                    <i class="fas fa-times"></i>
                </button>
            `;

            productsList.appendChild(productItem);
            this.updateRemoveButtons();
        });

        // Event delegation for remove buttons
        productsList.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.btn-remove');
            if (removeBtn && !removeBtn.disabled) {
                removeBtn.closest('.product-item').remove();
                this.updateRemoveButtons();
                this.updateProductPlaceholders();
            }
        });
    }

    updateRemoveButtons() {
        const productsList = document.getElementById('productsList');
        const items = productsList.querySelectorAll('.product-item');
        const removeButtons = productsList.querySelectorAll('.btn-remove');
        
        removeButtons.forEach((btn, index) => {
            btn.disabled = items.length <= 3;
        });
    }

    updateProductPlaceholders() {
        const productsList = document.getElementById('productsList');
        const inputs = productsList.querySelectorAll('input');
        inputs.forEach((input, index) => {
            input.placeholder = `Producto/Servicio ${index + 1}`;
        });
    }

    setupDemoControls() {
        const pauseBtn = document.getElementById('pauseBtn');
        const stopBtn = document.getElementById('stopBtn');
        const restartBtn = document.getElementById('restartBtn');
        const copyBtn = document.getElementById('copyLinkBtn');

        pauseBtn.addEventListener('click', () => this.togglePause());
        stopBtn.addEventListener('click', () => this.stopDemo());
        restartBtn.addEventListener('click', () => this.restartDemo());
        copyBtn.addEventListener('click', () => this.copyShareLink());

        // Share buttons
        document.querySelector('.btn-share.whatsapp').addEventListener('click', () => this.shareWhatsApp());
        document.querySelector('.btn-share.email').addEventListener('click', () => this.shareEmail());
    }

    generateDemo() {
        // Collect form data
        const businessName = document.getElementById('businessName').value.trim();
        const productInputs = document.querySelectorAll('#productsList input');
        const products = Array.from(productInputs)
            .map(input => input.value.trim())
            .filter(value => value !== '');

        const speed = document.getElementById('demoSpeed').value;
        const queryTypes = Array.from(document.querySelectorAll('input[name="queryType"]:checked'))
            .map(cb => cb.value);

        // Validate
        if (!businessName || products.length < 3) {
            this.showNotification('Completa todos los campos requeridos', 'error');
            return;
        }

        if (queryTypes.length === 0) {
            this.showNotification('Selecciona al menos un tipo de consulta', 'error');
            return;
        }

        // Store demo data
        this.demoData = {
            businessName,
            products,
            speed,
            queryTypes
        };

        // Generate messages
        this.messages = this.createDemoMessages();

        // Start demo
        this.startDemo();
    }

    createDemoMessages() {
        const { businessName, products, queryTypes } = this.demoData;
        const messages = [];

        // Mensaje de bienvenida del bot
        messages.push({
            type: 'bot',
            text: `¡Hola! Bienvenido a ${businessName}. Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?`,
            delay: 0
        });

        // Generar consultas basadas en los tipos seleccionados
        if (queryTypes.includes('products')) {
            messages.push({
                type: 'user',
                text: '¿Qué productos tienen disponibles?',
                delay: 1000
            });

            const productList = products.map((p, i) => `${i + 1}. ${p}`).join('\n');
            messages.push({
                type: 'bot',
                text: `Contamos con los siguientes productos/servicios:\n\n${productList}\n\n¿Te gustaría saber más sobre alguno en particular?`,
                delay: 1500
            });

            // Consulta específica sobre un producto
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            messages.push({
                type: 'user',
                text: `Me interesa ${randomProduct}`,
                delay: 1000
            });

            messages.push({
                type: 'bot',
                text: `¡Excelente elección! ${randomProduct} es uno de nuestros productos más populares. Te proporciona gran calidad y satisfacción. ¿Quieres conocer más detalles?`,
                delay: 1500
            });
        }

        if (queryTypes.includes('prices')) {
            messages.push({
                type: 'user',
                text: '¿Cuáles son sus precios?',
                delay: 1000
            });

            messages.push({
                type: 'bot',
                text: `Nuestros precios varían según el producto/servicio. Te puedo compartir nuestra lista de precios completa. ¿Deseas que un asesor se comunique contigo para darte información personalizada?`,
                delay: 1500
            });

            messages.push({
                type: 'user',
                text: 'Sí, me gustaría',
                delay: 800
            });

            messages.push({
                type: 'bot',
                text: `Perfecto. Un asesor de ${businessName} te contactará pronto para brindarte información detallada y personalizada. ¿Hay algo más en lo que pueda ayudarte?`,
                delay: 1500
            });
        }

        if (queryTypes.includes('hours')) {
            messages.push({
                type: 'user',
                text: '¿Cuál es su horario de atención?',
                delay: 1000
            });

            messages.push({
                type: 'bot',
                text: `Nuestro horario de atención es:\n\n📅 Lunes a Viernes: 8:00 AM - 6:00 PM\n📅 Sábados: 9:00 AM - 2:00 PM\n📅 Domingos: Cerrado\n\nEstamos aquí para atenderte. 😊`,
                delay: 1500
            });
        }

        if (queryTypes.includes('location')) {
            messages.push({
                type: 'user',
                text: '¿Hacen entregas a domicilio?',
                delay: 1000
            });

            messages.push({
                type: 'bot',
                text: `¡Sí! En ${businessName} realizamos entregas a domicilio. El costo y tiempo de entrega depende de tu ubicación. ¿Me compartes tu dirección para darte información exacta?`,
                delay: 1500
            });

            messages.push({
                type: 'user',
                text: 'Zona 10, Ciudad de Guatemala',
                delay: 1000
            });

            messages.push({
                type: 'bot',
                text: `Perfecto, hacemos entregas a Zona 10. El tiempo estimado es de 30-45 minutos y el costo de envío es de Q25. ¿Te gustaría hacer un pedido?`,
                delay: 1500
            });
        }

        // Mensaje de cierre
        messages.push({
            type: 'user',
            text: 'Gracias por la información',
            delay: 1000
        });

        messages.push({
            type: 'bot',
            text: `¡De nada! Gracias por contactar a ${businessName}. Estamos para servirte. Si necesitas algo más, no dudes en escribirnos. ¡Que tengas un excelente día! 🚀`,
            delay: 1500
        });

        return messages;
    }

    async startDemo() {
        console.log('🚀 Iniciando demo automática...');
        
        // Hide config panel info and show controls
        document.getElementById('demoInfo').style.display = 'none';
        this.enableControls(true);

        // Initialize chatbot if not exists
        if (!this.chatbot) {
            this.chatbot = new AIBotEngine();
            // Wait a bit for chatbot to initialize
            await this.sleep(500);
        }

        // Open chatbot
        if (!this.chatbot.isOpen) {
            document.getElementById('chat-bubble').click();
            await this.sleep(1000);
        }

        // Clear previous messages
        const messagesContainer = document.getElementById('messages-container');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }

        this.isRunning = true;
        this.isPaused = false;
        this.currentIndex = 0;

        this.playNextMessage();
    }

    async playNextMessage() {
        if (!this.isRunning || this.isPaused) return;

        if (this.currentIndex >= this.messages.length) {
            this.completeDemo();
            return;
        }

        const message = this.messages[this.currentIndex];
        
        // Wait for delay
        await this.sleep(message.delay);

        if (!this.isRunning || this.isPaused) return;

        // Send message
        if (message.type === 'user') {
            this.simulateUserMessage(message.text);
        } else {
            this.simulateBotMessage(message.text);
        }

        this.currentIndex++;

        // Schedule next message
        const speed = this.speeds[this.demoData.speed];
        this.timeoutId = setTimeout(() => this.playNextMessage(), speed);
    }

    simulateUserMessage(text) {
        const messagesContainer = document.getElementById('messages-container');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">${this.escapeHtml(text)}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        console.log('👤 Usuario:', text);
    }

    simulateBotMessage(text) {
        const messagesContainer = document.getElementById('messages-container');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">${this.escapeHtml(text).replace(/\n/g, '<br>')}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        console.log('🤖 Bot:', text);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pauseBtn');
        const icon = pauseBtn.querySelector('i');

        if (this.isPaused) {
            icon.className = 'fas fa-play';
            clearTimeout(this.timeoutId);
            console.log('⏸️ Demo pausada');
        } else {
            icon.className = 'fas fa-pause';
            this.playNextMessage();
            console.log('▶️ Demo reanudada');
        }
    }

    stopDemo() {
        this.isRunning = false;
        this.isPaused = false;
        clearTimeout(this.timeoutId);
        this.enableControls(false);
        
        console.log('⏹️ Demo detenida');
        this.showNotification('Demo detenida', 'info');
    }

    restartDemo() {
        console.log('🔄 Reiniciando demo...');
        this.stopDemo();
        setTimeout(() => this.startDemo(), 500);
    }

    completeDemo() {
        this.isRunning = false;
        this.enableControls(false);
        
        console.log('✅ Demo completada');
        this.showNotification('¡Demo completada! 🎉', 'success');
        
        // Show share section
        this.generateShareLink();
        document.getElementById('shareSection').style.display = 'block';
    }

    enableControls(enabled) {
        document.getElementById('pauseBtn').disabled = !enabled;
        document.getElementById('stopBtn').disabled = !enabled;
        document.getElementById('restartBtn').disabled = !enabled;

        if (!enabled) {
            const pauseBtn = document.getElementById('pauseBtn');
            pauseBtn.querySelector('i').className = 'fas fa-pause';
        }
    }

    generateShareLink() {
        const data = btoa(JSON.stringify(this.demoData));
        const baseUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${baseUrl}?demo=${data}`;
        
        document.getElementById('shareLinkInput').value = shareUrl;
    }

    copyShareLink() {
        const input = document.getElementById('shareLinkInput');
        input.select();
        document.execCommand('copy');
        
        this.showNotification('¡Link copiado al portapapeles!', 'success');
    }

    shareWhatsApp() {
        const link = document.getElementById('shareLinkInput').value;
        const text = `¡Mira esta demo de chatbot para ${this.demoData.businessName}! ${link}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        
        window.open(whatsappUrl, '_blank');
    }

    shareEmail() {
        const link = document.getElementById('shareLinkInput').value;
        const subject = `Demo de Chatbot - ${this.demoData.businessName}`;
        const body = `Te comparto esta demostración automática de chatbot para ${this.demoData.businessName}:\n\n${link}\n\n¡Pruébala!`;
        
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#0ea5e9'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            font-weight: 600;
            z-index: 100000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Demo Generator inicializado');
    const demoGenerator = new DemoGenerator();

    // Check for demo parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const demoData = urlParams.get('demo');
    
    if (demoData) {
        try {
            const data = JSON.parse(atob(demoData));
            console.log('📥 Cargando demo compartida:', data);
            // Auto-fill form and start demo
            // Implementation for auto-loading shared demos
        } catch (e) {
            console.error('Error loading shared demo:', e);
        }
    }
});

// Add animations CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
