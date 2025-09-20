import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import router from "./routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("combined"));

app.use(express.static(path.join(__dirname, "..", "public"), { index: "index.html" }));

app.use(router);

app.use((req, res) => {
res.status(404).json({ error: "No encontrado" });
});

app.listen(PORT, () => {
console.log('Servidor listo en puerto'+ '${PORT}');
});

import { Router } from "express";
const router = Router();

router.post("/api/enviarDemo", (req, res) => {
  const { nombre, correo, telefono, mensaje } = req.body;
  console.log("Datos recibidos:", nombre, correo, telefono, mensaje);
  
  // Aquí puedes: guardar en DB, mandar correo, etc.
  res.json({ ok: true, msg: "Datos recibidos correctamente" });
});

export default router;
