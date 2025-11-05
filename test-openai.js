// Test de API Key de OpenAI
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

console.log('🔍 Verificando configuración de OpenAI...');
console.log('📋 Variables de entorno:');
console.log('  - OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Configurada ✅' : 'NO CONFIGURADA ❌');
console.log('  - PORT:', process.env.PORT);
console.log('  - NODE_ENV:', process.env.NODE_ENV);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
    try {
        console.log('\n🤖 Probando conexión con OpenAI...');
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Eres un asistente útil. Responde en español."
                },
                {
                    role: "user", 
                    content: "Hola, solo di 'Conexión exitosa' en una línea"
                }
            ],
            max_tokens: 50,
            temperature: 0.1
        });

        const response = completion.choices[0]?.message?.content?.trim();
        
        if (response) {
            console.log('✅ ÉXITO: OpenAI respondió correctamente');
            console.log('📄 Respuesta:', response);
            console.log('💰 Tokens usados:', completion.usage?.total_tokens || 'No disponible');
        } else {
            console.log('❌ ERROR: No se recibió respuesta de OpenAI');
        }
        
    } catch (error) {
        console.log('❌ ERROR de conexión:');
        console.log('   Tipo:', error.constructor.name);
        console.log('   Mensaje:', error.message);
        
        if (error.status) {
            console.log('   Status HTTP:', error.status);
        }
        
        if (error.status === 401) {
            console.log('🚨 API Key inválida o sin permisos');
        } else if (error.status === 429) {
            console.log('🚨 Límite de requests excedido');
        } else if (error.status === 403) {
            console.log('🚨 API Key sin permisos para este modelo');
        }
    }
}

// Ejecutar test
testOpenAI().then(() => {
    console.log('\n🏁 Test completado');
    process.exit(0);
}).catch((error) => {
    console.log('\n💥 Error fatal:', error);
    process.exit(1);
});