const express  = require("express");
const nodemailer = require("nodemailer");
const cors     = require("cors");
require("dotenv").config();

const app  = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Configurar transporter de Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Ruta de contacto
app.post("/api/contacto", async (req, res) => {
  const { nombre, email, asunto, mensaje } = req.body;

  if (!nombre || !email || !asunto || !mensaje) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    await transporter.sendMail({
      from:    `"${nombre}" <${process.env.EMAIL_USER}>`,
      to:      process.env.EMAIL_TO,
      subject: `Portafolio — ${asunto}`,
      html: `
        <div style="font-family:sans-serif; max-width:600px; margin:auto;">
          <h2 style="color:#00f5ff;">Nuevo mensaje desde tu Portafolio</h2>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Asunto:</strong> ${asunto}</p>
          <hr/>
          <p><strong>Mensaje:</strong></p>
          <p>${mensaje}</p>
        </div>
      `,
    });

    res.json({ ok: true, message: "Email enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar email:", error);
    res.status(500).json({ error: "Error al enviar el email" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});




