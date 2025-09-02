import { Router } from "express";

const router = Router();

router.get("/api/health", (req, res) => {
res.json({ ok: true, service: "botenginecorp", time: new Date().toISOString() });
});

router.get("/api/info", (req, res) => {
res.json({
name: process.env.APP_NAME || "BotEngineCorp",
env: process.env.APP_ENV || "development",
version: "1.0.0"
});
});

router.post("/api/demo", (req, res) => {
  const { nombre, email, telefono, mensaje } = req.body || {};
  if (!nombre || !email) {
    return res.status(400).json({ ok: false, error: "Faltan campos obligatorios" });
  }

  
  console.log("[DEMO] Nueva solicitud:", { nombre, email, telefono, mensaje, fecha: new Date().toISOString() });
  return res.json({ ok: true });
});

export default router;