import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

router.post("/api/demo", async (req, res) => {
  const { nombre, email, telefono, mensaje } = req.body || {};

  if (!nombre || !email) {
    return res.status(400).json({ ok: false, error: "Faltan campos obligatorios" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.MAIL_PORT || 465),
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"BotEngine Web" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,
      replyTo: `${nombre} <${email}>`,
      subject: "Nueva solicitud de demo",
      text: `Nombre: ${nombre}
Email: ${email}
Teléfono: ${telefono || ""}
Mensaje:
${mensaje || ""}`,
      html: `
        <h2>Nueva solicitud de demo</h2>
        <p><b>Nombre:</b> ${nombre}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Teléfono:</b> ${telefono || ""}</p>
        <p><b>Mensaje:</b><br>${(mensaje || "").replace(/\n/g, "<br>")}</p>
      `
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("Error al enviar correo:", err);
    return res.status(500).json({ ok: false, error: "No se pudo enviar el correo" });
  }
});

// Diagnóstico SMTP
router.get("/api/smtp-check", async (req, res) => {
  try {
    const transporter = require("nodemailer").createTransport({
      host: process.env.MAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.MAIL_PORT || 465),
      secure: true,
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
      connectionTimeout: 15000
    });
    await transporter.verify();
    return res.json({ ok: true });
  } catch (err) {
    console.error("SMTP verify error:", { code: err.code, command: err.command, message: err.message, response: err.response });
    return res.status(500).json({
      ok: false,
      code: err && err.code ? String(err.code) : "UNKNOWN",
      msg: err && err.message ? String(err.message) : "Error"
    });
  }
});



export default router;
