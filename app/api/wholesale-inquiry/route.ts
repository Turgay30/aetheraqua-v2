import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { businessName, contactName, phone, email, city, estimatedQuantity, message } = body;

  if (!businessName || !contactName || !phone || !email) {
    return NextResponse.json({ error: "Eksik bilgi." }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("wholesale_inquiries").insert({
    business_name: businessName,
    contact_name: contactName,
    phone,
    email,
    city: city || null,
    estimated_quantity: estimatedQuantity || null,
    message: message || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Mağaza sahibine bildirim e-postası — başarısız olsa da talep zaten kaydedildi
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
          subject: `Yeni Toptan Satış Talebi — ${businessName}`,
          html: `
            <div style="font-family:Arial,sans-serif;font-size:14px;color:#1a1a1a;">
              <h2>Yeni Toptan Satış Talebi</h2>
              <p><strong>İşletme:</strong> ${businessName}</p>
              <p><strong>Yetkili:</strong> ${contactName}</p>
              <p><strong>Telefon:</strong> ${phone}</p>
              <p><strong>E-posta:</strong> ${email}</p>
              <p><strong>Şehir:</strong> ${city || "-"}</p>
              <p><strong>Tahmini Adet:</strong> ${estimatedQuantity || "-"}</p>
              <p><strong>Mesaj:</strong><br/>${message || "-"}</p>
            </div>`,
        }),
      });
    } catch {
      // e-posta gönderilemese bile talep kaydedildi, kritik değil
    }
  }

  return NextResponse.json({ ok: true });
}
