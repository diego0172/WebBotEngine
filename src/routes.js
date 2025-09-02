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

export default router;