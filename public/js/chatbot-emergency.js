// CHATBOT ULTRA SIMPLE - VERSIÓN DE EMERGENCIA
console.log('🚨 INICIANDO CHATBOT DE EMERGENCIA...');

function createEmergencyChatbot() {
    // Crear el HTML más simple posible
    const html = `
    <div style="position:fixed!important;bottom:20px!important;left:20px!important;z-index:99999!important;">
        <div onclick="toggleChat()" style="width:65px!important;height:65px!important;background:linear-gradient(135deg,#0ea5e9,#8b5cf6)!important;border-radius:50%!important;display:flex!important;align-items:center!important;justify-content:center!important;cursor:pointer!important;box-shadow:0 8px 25px rgba(14,165,233,0.6)!important;font-size:28px!important;color:white!important;border:3px solid rgba(255,255,255,0.3)!important;animation:bounce 2s infinite ease-in-out!important;">
            🤖
            <div style="position:absolute!important;top:-5px!important;right:-5px!important;width:22px!important;height:22px!important;background:#ef4444!important;color:white!important;border-radius:50%!important;display:flex!important;align-items:center!important;justify-content:center!important;font-size:12px!important;font-weight:bold!important;animation:pulse 1.5s infinite!important;border:2px solid white!important;">1</div>
        </div>
        
        <div id="emergency-chat-window" style="position:absolute!important;bottom:80px!important;left:0!important;width:350px!important;height:480px!important;background:rgba(15,23,42,0.95)!important;border-radius:16px!important;border:1px solid rgba(14,165,233,0.3)!important;box-shadow:0 20px 60px rgba(0,0,0,0.5)!important;display:none!important;flex-direction:column!important;backdrop-filter:blur(20px)!important;">
            
            <div style="background:linear-gradient(135deg,rgba(14,165,233,0.2),rgba(139,92,246,0.2))!important;padding:16px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;border-bottom:1px solid rgba(255,255,255,0.1)!important;border-radius:16px 16px 0 0!important;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <div style="width:40px;height:40px;background:linear-gradient(135deg,#0ea5e9,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;">🤖</div>
                    <div>
                        <h4 style="margin:0;color:#f8fafc;font-size:16px;">WebBot Assistant</h4>
                        <span style="color:#10b981;font-size:12px;">🟢 En línea</span>
                    </div>
                </div>
                <button onclick="closeChat()" style="background:none;border:none;color:#94a3b8;cursor:pointer;padding:8px;border-radius:6px;font-size:18px;">×</button>
            </div>
            
            <div id="emergency-messages" style="flex:1!important;padding:16px!important;overflow-y:auto!important;max-height:300px!important;">
                <div style="background:rgba(30,41,59,0.8);color:#f8fafc;padding:12px 16px;border-radius:18px 18px 18px 4px;margin-bottom:12px;border:1px solid rgba(255,255,255,0.1);">
                    ¡Hola! 👋 Soy tu asistente virtual de WebBotEngine. ¿En qué puedo ayudarte con nuestros servicios?
                </div>
            </div>
            
            <div style="padding:16px!important;border-top:1px solid rgba(255,255,255,0.1)!important;display:flex!important;gap:12px!important;">
                <input id="emergency-input" type="text" placeholder="Escribe tu mensaje..." style="flex:1!important;background:rgba(30,41,59,0.8)!important;border:1px solid rgba(255,255,255,0.1)!important;border-radius:20px!important;padding:12px 16px!important;color:#f8fafc!important;font-size:14px!important;outline:none!important;">
                <button onclick="sendEmergencyMessage()" style="width:40px!important;height:40px!important;background:linear-gradient(135deg,#0ea5e9,#8b5cf6)!important;border:none!important;border-radius:50%!important;color:white!important;cursor:pointer!important;display:flex!important;align-items:center!important;justify-content:center!important;font-size:16px!important;">📩</button>
            </div>
        </div>
    </div>
    
    <style>
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-3px); }
            60% { transform: translateY(-1px); }
        }
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
        }
    </style>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
    console.log('✅ CHATBOT DE EMERGENCIA INSERTADO');
}

// Funciones globales simples
window.toggleChat = function() {
    console.log('🔄 Abriendo/cerrando chat...');
    const window = document.getElementById('emergency-chat-window');
    if (window) {
        if (window.style.display === 'none' || window.style.display === '') {
            window.style.display = 'flex';
            console.log('✅ Chat abierto');
        } else {
            window.style.display = 'none';
            console.log('✅ Chat cerrado');
        }
    }
};

window.closeChat = function() {
    console.log('❌ Cerrando chat...');
    const window = document.getElementById('emergency-chat-window');
    if (window) {
        window.style.display = 'none';
    }
};

window.sendEmergencyMessage = function() {
    const input = document.getElementById('emergency-input');
    const messages = document.getElementById('emergency-messages');
    
    if (input && messages && input.value.trim()) {
        const message = input.value.trim();
        console.log('📤 Enviando:', message);
        
        // Agregar mensaje del usuario
        messages.innerHTML += `
            <div style="background:linear-gradient(135deg,#0ea5e9,#8b5cf6);color:white;padding:12px 16px;border-radius:18px 18px 4px 18px;margin-bottom:12px;margin-left:60px;">
                ${message}
            </div>
        `;
        
        input.value = '';
        
        // Respuesta automática
        setTimeout(() => {
            const responses = [
                '🚀 ¡Genial! Te ayudo con información sobre nuestros servicios de chatbots y páginas web.',
                '💡 Ofrecemos automatización 24/7 para WhatsApp, Instagram y sitios web.',
                '📞 Para cotización personalizada, completa nuestro formulario de contacto.',
                '🎯 ¿Te interesa una demo de nuestros chatbots inteligentes?'
            ];
            const response = responses[Math.floor(Math.random() * responses.length)];
            
            messages.innerHTML += `
                <div style="background:rgba(30,41,59,0.8);color:#f8fafc;padding:12px 16px;border-radius:18px 18px 18px 4px;margin-bottom:12px;border:1px solid rgba(255,255,255,0.1);margin-right:60px;">
                    ${response}
                </div>
            `;
            
            messages.scrollTop = messages.scrollHeight;
        }, 1000);
        
        messages.scrollTop = messages.scrollHeight;
    }
};

// Ejecutar inmediatamente
createEmergencyChatbot();

// Enter para enviar
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && document.getElementById('emergency-input') === document.activeElement) {
        sendEmergencyMessage();
    }
});

console.log('🎉 CHATBOT DE EMERGENCIA LISTO - Haz clic en la burbuja 🤖');