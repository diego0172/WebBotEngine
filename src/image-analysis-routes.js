import { Router } from "express";
import OpenAI from "openai";

const router = Router();

/**
 * POST /api/analyze-product-image
 * Analiza una imagen de producto usando OpenAI Vision
 * Recibe: { image: "data:image/jpeg;base64,...", mimeType: "image/jpeg" }
 */
router.post('/analyze-product-image', async (req, res) => {
  const { image, mimeType = 'image/jpeg' } = req.body;

  if (!image) {
    return res.status(400).json({
      ok: false,
      error: 'No se proporcionó imagen'
    });
  }

  try {
    // La imagen ya viene en base64
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    // Inicializar OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Analizar imagen con visión
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
            {
              type: "text",
              text: `Analiza esta imagen de un producto y devuelve en formato JSON:
{
  "producto_nombre": "nombre del producto detectado",
  "descripcion": "descripción del producto",
  "marcas_detectadas": ["marca1", "marca2"],
  "precio_visible": "si hay precio visible",
  "codigo_barras": "si detectas código de barras",
  "caracteristicas": ["caracteristica1", "caracteristica2"],
  "recomendaciones": "recomendaciones basadas en lo que ves",
  "confianza": "alta/media/baja"
}

Sé muy específico y detallado. Si es un código de barras, intenta leerlo.`
            }
          ],
        }
      ],
      max_tokens: 1024,
    });

    // Parsear respuesta
    let analysisResult = null;
    try {
      const content = response.choices[0].message.content;
      // Extraer JSON de la respuesta
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        analysisResult = { raw_response: content };
      }
    } catch (parseError) {
      analysisResult = {
        raw_response: response.choices[0].message.content
      };
    }

    res.json({
      ok: true,
      analysis: analysisResult,
      message: '✅ Análisis completado exitosamente'
    });

  } catch (error) {
    console.error('Error en análisis de imagen:', error);

    res.status(500).json({
      ok: false,
      error: error.message || 'Error al analizar la imagen'
    });
  }
});

export default router;
