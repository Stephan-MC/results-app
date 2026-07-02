import express from "express";
import path from "path";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Route to send email
  app.post("/api/send-email", async (req, res) => {
    console.log("Email trigger request received.");

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.EMAIL_FROM || "Lycée de St. Jude <noreply@example.com>";
    const to = process.env.EMAIL_TO;

    // Check if configuration is present
    if (!host || !port || !user || !pass || !to) {
      console.warn("SMTP settings are incomplete. Sending skipped (Demo mode).");
      return res.status(200).json({
        success: false,
        status: "unconfigured",
        message: "Les paramètres SMTP ne sont pas configurés dans les variables d'environnement. L'envoi de l'e-mail a été simulé avec succès.",
        details: {
          host: host || "Non configuré",
          port: port || "Non configuré",
          user: user ? "••••••••" : "Non configuré",
          pass: pass ? "••••••••" : "Non configuré",
          to: to || "Non configuré",
          from: from
        }
      });
    }

    try {
      // Lazy initialize nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: host,
        port: parseInt(port, 10),
        secure: parseInt(port, 10) === 465, // true for 465, false for other ports
        auth: {
          user: user,
          pass: pass,
        },
      });

      // HTML body for the results email
      const htmlContent = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1e293b;">
          <div style="text-align: center; border-bottom: 2px solid #4338ca; padding-bottom: 15px; margin-bottom: 20px;">
            <h1 style="color: #4338ca; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">Lycée de St. Jude</h1>
            <p style="color: #64748b; margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Secrétariat du Probatoire Académique</p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <p style="font-size: 14px; line-height: 1.6;">Bonjour,</p>
            <p style="font-size: 14px; line-height: 1.6;">Nous vous informons que le portail académique officiel du <strong>Lycée de St. Jude</strong> vient d'être consulté pour l'accès aux résultats officiels du <strong>Probatoire 2026</strong> de l'élève ci-dessous :</p>
          </div>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin-bottom: 25px;">
            <h2 style="font-size: 12px; color: #4338ca; text-transform: uppercase; margin-top: 0; margin-bottom: 10px; letter-spacing: 1px;">Fiche de Synthèse de l'Élève</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 4px 0; color: #64748b; font-weight: bold; width: 40%;">Nom Complet :</td>
                <td style="padding: 4px 0; color: #0f172a; font-weight: bold;">Kota Franck Steve</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #64748b; font-weight: bold;">Série / Classe :</td>
                <td style="padding: 4px 0; color: #0f172a;">Première C (Sciences Exactes)</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #64748b; font-weight: bold;">Moyenne Générale :</td>
                <td style="padding: 4px 0; color: #15803d; font-weight: bold; font-size: 14px;">16.89 / 20</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #64748b; font-weight: bold;">Mention :</td>
                <td style="padding: 4px 0; color: #15803d; font-weight: bold;">Très Bien</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #64748b; font-weight: bold;">Rang de la classe :</td>
                <td style="padding: 4px 0; color: #0f172a;">2<sup>e</sup> sur 28 élèves</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #64748b; font-weight: bold;">Taux d'Assiduité :</td>
                <td style="padding: 4px 0; color: #0f172a;">96.20% de présence</td>
              </tr>
            </table>
          </div>

          <div style="margin-bottom: 25px;">
            <h2 style="font-size: 12px; color: #4338ca; text-transform: uppercase; margin-top: 0; margin-bottom: 10px; letter-spacing: 1px;">Détails des Notes du Trimestre 1</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: left;">
              <thead>
                <tr style="background-color: #f1f5f9; color: #475569; font-weight: bold; text-transform: uppercase; font-size: 10px;">
                  <th style="padding: 8px; border: 1px solid #e2e8f0;">Matière</th>
                  <th style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">Coef</th>
                  <th style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">Note/20</th>
                  <th style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">Mention</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Mathématiques</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">5</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold;">18.60</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; color: #15803d;">Très Bien</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Physique</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">3</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold;">17.80</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; color: #15803d;">Très Bien</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Chimie</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">2</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold;">16.80</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; color: #15803d;">Très Bien</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Sciences de la Vie (SVT)</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">2</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold;">14.00</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; color: #0369a1;">Bien</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Français</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">3</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold;">14.00</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; color: #0369a1;">Bien</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Anglais</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">2</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold;">15.60</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; color: #0369a1;">Bien</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Histoire-Géographie</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">2</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold;">15.80</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; color: #0369a1;">Bien</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">Informatique</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">2</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold;">19.00</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; color: #15803d;">Très Bien</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: bold;">ECM</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">1</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold;">16.80</td>
                  <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; color: #15803d;">Très Bien</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="background-color: #f8fafc; border-left: 4px solid #4338ca; border-radius: 4px; padding: 12px; margin-bottom: 25px;">
            <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #4338ca; margin: 0 0 5px 0; font-weight: bold;">Appréciation Générale</p>
            <p style="font-size: 13px; line-height: 1.5; color: #334155; margin: 0; font-style: italic;">
              "Franck Steve continue d'exceller dans toutes les disciplines scientifiques du Probatoire C. Son raisonnement logique et ses compétences expérimentales sont particulièrement remarquables."
            </p>
          </div>

          <div style="font-size: 11px; color: #64748b; line-height: 1.5; border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center;">
            <p style="margin: 0;">Ce document est un relevé numérique certifié conforme par le Lycée de St. Jude.</p>
            <p style="margin: 3px 0 0 0;">Identifiant de transaction : OB-PROB-KOTA-2026</p>
          </div>
        </div>
      `;

      // Send mail
      await transporter.sendMail({
        from: from,
        to: to,
        subject: `[Lycée de St. Jude] Notification de Résultats - Kota Franck Steve (Probatoire 2026)`,
        text: `Bonjour, les résultats scolaires de Kota Franck Steve pour le Probatoire 2026 (Première C) viennent d'être consultés sur le portail du Lycée de St. Jude. Moyenne générale : 16.89/20 (Très Bien). Rang de classe : 2e sur 28 élèves.`,
        html: htmlContent,
      });

      console.log("Email sent successfully to:", to);
      return res.status(200).json({
        success: true,
        message: "L'e-mail officiel des résultats a été envoyé avec succès.",
        recipient: to
      });
    } catch (error: any) {
      console.error("Failed to send email via SMTP:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de l'envoi de l'e-mail via SMTP.",
        error: error.message || error
      });
    }
  });

  // Serve static assets and handle Vite dev vs prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Lycée St. Jude Server] running on http://localhost:${PORT}`);
  });
}

startServer();
