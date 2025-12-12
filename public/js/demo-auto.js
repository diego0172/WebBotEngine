// Demo Automática - Integración con formulario de Index
(function() {
    'use strict';

    class AutoDemo {
        constructor() {
            this.demoData = null;
            this.messages = [];
            this.currentIndex = 0;
            this.isRunning = false;
            this.timeoutId = null;
            this.speeds = {
                slow: 3000,
                normal: 2000,
                fast: 1000
            };
            this.maxProducts = 8;
            this.init();
        }

        init() {
            // Wait for DOM to be fully loaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupForm());
            } else {
                this.setupForm();
            }
        }

        setupForm() {
            const form = document.getElementById('demoForm');
            const addBtn = document.getElementById('addProductBtn');
            const contactBtn = document.getElementById('btnContact');

            if (!form) {
                console.warn('Demo form not found');
                return;
            }

            // Setup add product button
            if (addBtn) {
                addBtn.addEventListener('click', () => this.addProductField());
            }

            // Setup form submission
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.startAutoDemo();
            });

            // Setup contact button
            if (contactBtn) {
                contactBtn.addEventListener('click', () => {
                    window.open('https://wa.me/50231239807?text=Hola%2C%20me%20gustar%C3%ADa%20informaci%C3%B3n%20sobre%20sus%20servicios', '_blank');
                });
            }

            console.log('✅ Demo automática lista');
        }

        addProductField() {
            const productsList = document.getElementById('productsList');
            const currentCount = productsList.querySelectorAll('.product-input').length;

            if (currentCount >= this.maxProducts) {
                this.showNotification('Máximo 8 productos permitidos', 'warning');
                return;
            }

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'product-input';
            input.placeholder = `Producto ${currentCount + 1}`;
            input.maxLength = 50;
            input.style.cssText = 'animation: slideIn 0.3s ease;';

            productsList.appendChild(input);
        }

        startAutoDemo() {
            // Collect form data
            const businessName = document.getElementById('businessName')?.value.trim();
            const productInputs = document.querySelectorAll('.product-input');
            const products = Array.from(productInputs)
                .map(input => input.value.trim())
                .filter(value => value !== '');

            const speed = document.getElementById('demoSpeed')?.value || 'normal';
            const queryTypes = Array.from(document.querySelectorAll('input[name="queryType"]:checked'))
                .map(cb => cb.value);

            // Validate
            if (!businessName || products.length < 3) {
                this.showNotification('Por favor completa el nombre del negocio y al menos 3 productos', 'error');
                return;
            }

            if (queryTypes.length === 0) {
                this.showNotification('Selecciona al menos un tipo de consulta', 'warning');
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

            // Show success message
            const demoMsg = document.getElementById('demoMsg');
            if (demoMsg) {
                demoMsg.style.display = 'block';
                setTimeout(() => {
                    demoMsg.style.display = 'none';
                }, 5000);
            }

            // Start demo
            setTimeout(() => this.runDemo(), 1000);
        }

        createDemoMessages() {
            const { businessName, products, queryTypes } = this.demoData;
            const messages = [];

            // Welcome message
            messages.push({
                type: 'bot',
                text: `¡Hola! Bienvenido a ${businessName}. Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?`,
                delay: 0
            });

            // Product queries
            if (queryTypes.includes('products')) {
                messages.push({
                    type: 'user',
                    text: '¿Qué productos tienen disponibles?',
                    delay: 1000
                });

                const productList = products.map((p, i) => `${i + 1}. ${p}`).join('\n');
                messages.push({
                    type: 'bot',
                    text: `Contamos con los siguientes productos/servicios:\n\n${productList}\n\n¿Te gustaría saber más sobre alguno?`,
                    delay: 1500
                });

                const randomProduct = products[Math.floor(Math.random() * products.length)];
                messages.push({
                    type: 'user',
                    text: `Me interesa ${randomProduct}`,
                    delay: 1000
                });

                messages.push({
                    type: 'bot',
                    text: `¡Excelente elección! ${randomProduct} es muy popular. Ofrece gran calidad. ¿Quieres más detalles?`,
                    delay: 1500
                });
            }

            // Price queries
            if (queryTypes.includes('prices')) {
                messages.push({
                    type: 'user',
                    text: '¿Cuáles son sus precios?',
                    delay: 1000
                });

                messages.push({
                    type: 'bot',
                    text: `Nuestros precios varían según el producto. ¿Te gustaría que un asesor te contacte con información personalizada?`,
                    delay: 1500
                });

                messages.push({
                    type: 'user',
                    text: 'Sí, por favor',
                    delay: 800
                });

                messages.push({
                    type: 'bot',
                    text: `Perfecto. Un asesor de ${businessName} te contactará pronto. ¿Algo más?`,
                    delay: 1500
                });
            }

            // Hours queries
            if (queryTypes.includes('hours')) {
                messages.push({
                    type: 'user',
                    text: '¿Cuál es su horario?',
                    delay: 1000
                });

                messages.push({
                    type: 'bot',
                    text: `Nuestro horario:\n\n📅 Lunes a Viernes: 8:00 AM - 6:00 PM\n📅 Sábados: 9:00 AM - 2:00 PM\n📅 Domingos: Cerrado\n\n¡Estamos para servirte! 😊`,
                    delay: 1500
                });
            }

            // Location queries
            if (queryTypes.includes('location')) {
                messages.push({
                    type: 'user',
                    text: '¿Hacen entregas?',
                    delay: 1000
                });

                messages.push({
                    type: 'bot',
                    text: `¡Sí! En ${businessName} hacemos entregas a domicilio. El costo depende de tu ubicación. ¿Dónde te encuentras?`,
                    delay: 1500
                });

                messages.push({
                    type: 'user',
                    text: 'Zona 10, Ciudad',
                    delay: 1000
                });

                messages.push({
                    type: 'bot',
                    text: `Perfecto, llegamos a Zona 10. Tiempo estimado: 30-45 min. Costo: Q25. ¿Deseas ordenar?`,
                    delay: 1500
                });
            }

            // Closing message
            messages.push({
                type: 'user',
                text: 'Gracias por la información',
                delay: 1000
            });

            messages.push({
                type: 'bot',
                text: `¡De nada! Gracias por contactar a ${businessName}. Estamos para servirte. ¡Excelente día! 🚀`,
                delay: 1500
            });

            return messages;
        }

        async runDemo() {
            console.log('🚀 Iniciando demo automática...');

            // Wait for chatbot to be available
            let attempts = 0;
            while (!window.AIBotEngine && attempts < 10) {
                await this.sleep(500);
                attempts++;
            }

            // Open chatbot if exists
            const chatBubble = document.getElementById('chat-bubble');
            if (chatBubble) {
                chatBubble.click();
                await this.sleep(1000);
            }

            this.isRunning = true;
            this.currentIndex = 0;

            this.playNextMessage();
        }

        async playNextMessage() {
            if (!this.isRunning || this.currentIndex >= this.messages.length) {
                if (this.currentIndex >= this.messages.length) {
                    this.completeDemo();
                }
                return;
            }

            const message = this.messages[this.currentIndex];

            // Wait for delay
            await this.sleep(message.delay);

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
            messageDiv.style.animation = 'slideIn 0.3s ease';
            messageDiv.innerHTML = `
                <div class="message-content">${this.escapeHtml(text)}</div>
            `;

            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        simulateBotMessage(text) {
            const messagesContainer = document.getElementById('messages-container');
            if (!messagesContainer) return;

            const messageDiv = document.createElement('div');
            messageDiv.className = 'message bot-message';
            messageDiv.style.animation = 'slideIn 0.3s ease';
            messageDiv.innerHTML = `
                <div class="message-avatar">🤖</div>
                <div class="message-content">${this.escapeHtml(text).replace(/\n/g, '<br>')}</div>
            `;

            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        completeDemo() {
            this.isRunning = false;
            console.log('✅ Demo completada');
            this.showNotification('¡Demo completada! 🎉', 'success');
        }

        showNotification(message, type = 'info') {
            const colors = {
                success: '#10b981',
                error: '#ef4444',
                warning: '#f59e0b',
                info: '#0ea5e9'
            };

            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 24px;
                background: ${colors[type] || colors.info};
                color: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                font-weight: 600;
                z-index: 100000;
                animation: slideInRight 0.3s ease;
            `;
            notification.textContent = message;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease';
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

    // Initialize
    new AutoDemo();

    // Add required animations
    if (!document.getElementById('demo-animations')) {
        const style = document.createElement('style');
        style.id = 'demo-animations';
        style.textContent = `
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes slideInRight {
                from { opacity: 0; transform: translateX(100px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes slideOutRight {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(100px); }
            }
        `;
        document.head.appendChild(style);
    }
})();
