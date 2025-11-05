// Test de Hugging Face IA - GRATIS
import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

console.log('🆓 Probando Hugging Face (IA Gratuita)...');

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY || 'hf_public');

async function testHuggingFace() {
    try {
        console.log('🤖 Enviando mensaje a Hugging Face...');
        
        const prompt = `Eres el asistente de WebBotEngine, especialistas en chatbots y páginas web. Un usuario pregunta: "Hola, que servicios ofrecen?"

Responde de manera amigable y profesional mencionando nuestros servicios principales:
- Chatbots inteligentes desde $299
- Páginas web desde $599  
- Automatización de procesos

Asistente:`;

        const response = await hf.textGeneration({
            model: 'microsoft/DialoGPT-medium',
            inputs: prompt,
            parameters: {
                max_new_tokens: 100,
                temperature: 0.7,
                do_sample: true,
                return_full_text: false
            }
        });

        console.log('✅ ÉXITO: Hugging Face respondió');
        console.log('📄 Respuesta:', response.generated_text);
        console.log('💰 Costo: GRATIS 🎉');
        
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        
        if (error.message.includes('Rate limit')) {
            console.log('🚨 Límite temporal alcanzado, reintenta en unos minutos');
        } else if (error.message.includes('Model')) {
            console.log('🚨 Problema con el modelo, probando alternativo...');
            await testAlternativeModel();
        } else {
            console.log('🚨 Error desconocido');
        }
    }
}

async function testAlternativeModel() {
    try {
        console.log('🔄 Probando modelo alternativo...');
        
        const response = await hf.textGeneration({
            model: 'gpt2',
            inputs: "WebBotEngine ofrece servicios de",
            parameters: {
                max_new_tokens: 50,
                temperature: 0.8
            }
        });

        console.log('✅ Modelo alternativo funciona');
        console.log('📄 Respuesta:', response.generated_text);
        
    } catch (altError) {
        console.log('❌ Modelo alternativo también falló:', altError.message);
    }
}

testHuggingFace().then(() => {
    console.log('\n🏁 Test de IA gratuita completado');
    process.exit(0);
});