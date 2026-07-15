import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function generateCode(): string {
  return "HEDIYE-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function POST(request: Request) {
  const body = await request.json();
  const {
    amount,
    purchaserName,
    purchaserEmail,
    purchaserPhone,
    recipientName,
    recipientEmail,
    message,
  } = body;

  if (!amount || !purchaserName || !purchaserEmail || !recipientName || !recipientEmail) {
    return NextResponse.json({ error: "Eksik bilgi." }, { status: 400 });
  }

  const supabase = await createClient();
  const code = generateCode();

  const { error } = await supabase.from("gift_cards").insert({
    code,
    amount,
    purchaser_name: purchaserName,
    purchaser_email: purchaserEmail,
    purchaser_phone: purchaserPhone || null,
    recipient_name: recipientName,
    recipient_email: recipientEmail,
    message: message || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "AetherAqua <noreply@aetheraqua.com>",
          to: "infoaetheraqua@gmail.com",
          subject: `Yeni Hediye Kartı Talebi — ${amount} TL`,
          html: `
            <div style="font-family:Arial,sans-serif;font-size:14px;color:#1a1a1a;">
              <h2>Yeni Hediye Kartı Talebi</h2>
              <p><strong>Tutar:</strong> ${amount} TL</p>
              <p><strong>Alıcı (satın alan):</strong> ${purchaserName} — ${purchaserEmail} — ${purchaserPhone || "-"}</p>
              <p><strong>Hediye edilen:</strong> ${recipientName} — ${recipientEmail}</p>
              <p><strong>Mesaj:</strong><br/>${message || "-"}</p>
              <p style="margin-top:16px;color:#888;">Ödemeyi tahsil ettikten sonra admin panelden onaylayıp gönderebilirsiniz.</p>
            </div>`,
        }),
      });
    } catch {
      // e-posta gönderilemese bile talep kaydedildi
    }
  }

  return NextResponse.json({ ok: true });
}
