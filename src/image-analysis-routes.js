import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

// Configurar multer para guardar archivos temporalmente
const uploadDir = path.join(__dirname, '..', 'uploads', 'temp');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Solo se permiten archivos de imagen'));
      return;
    }
    cb(null, true);
  }
});

/**
 * POST /api/analyze-product-image
 * Analiza una imagen de producto usando OpenAI Vision
 */
router.post('/api/analyze-product-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      ok: false,
      error: 'No se subió ninguna imagen'
    });
  }

  try {
    // Leer imagen como base64
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = req.file.mimetype;

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

    // Limpiar archivo temporal
    fs.unlinkSync(req.file.path);

    res.json({
      ok: true,
      analysis: analysisResult,
      message: '✅ Análisis completado exitosamente'
    });

  } catch (error) {
    console.error('Error en análisis de imagen:', error);
    
    // Limpiar archivo en caso de error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      ok: false,
      error: error.message || 'Error al analizar la imagen'
    });
  }
});

export default router;
