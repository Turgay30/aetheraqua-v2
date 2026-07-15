import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = "turgayturan705@gmail.com";

function formatTL(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const { giftCardId } = await request.json();
  const { data: giftCard } = await supabase
    .from("gift_cards")
    .select("*")
    .eq("id", giftCardId)
    .maybeSingle();

  if (!giftCard) {
    return NextResponse.json({ error: "Hediye kartı bulunamadı." }, { status: 404 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "E-posta servisi yapılandırılmamış." }, { status: 500 });
  }

  const html = `
  <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B1220;border-radius:16px;overflow:hidden;">
      <tr>
        <td style="background:linear-gradient(90deg,#0B1220,#101B2C);padding:36px 40px 28px;border-bottom:1px solid #1E2A3A;">
          <p style="margin:0;font-family:Georgia,serif;font-size:22px;">
            <span style="color:#E7ECEF;">AETHER</span><span style="color:#22D3B8;">AQUA</span>
          </p>
          <p style="margin:6px 0 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7C8794;">
            Hediye Kartı
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:40px;">
          <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#C9A227;">
            Size Bir Hediye Var
          </p>
          <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:26px;color:#ffffff;font-weight:normal;">
            Merhaba ${giftCard.recipient_name},
          </h1>
          <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#A6B0BC;">
            <strong style="color:#E7ECEF;">${giftCard.purchaser_name}</strong> size AetherAqua'dan bir hediye kartı gönderdi!
          </p>
          ${
            giftCard.message
              ? `<p style="margin:0 0 20px;padding:16px;background:#101B2C;border-radius:12px;font-family:Arial,sans-serif;font-size:14px;font-style:italic;color:#A6B0BC;">"${giftCard.message}"</p>`
              : ""
          }
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;">
            <tr>
              <td style="background-color:#101B2C;border:1px solid #C9A227;border-radius:12px;padding:20px 28px;text-align:center;">
                <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;color:#7C8794;">HEDİYE KARTI TUTARI</p>
                <p style="margin:6px 0 0;font-family:Georgia,serif;font-size:28px;color:#C9A227;">${formatTL(Number(giftCard.amount))}</p>
                <p style="margin:14px 0 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;color:#7C8794;">KOD</p>
                <p style="margin:4px 0 0;font-family:'Courier New',monospace;font-size:20px;letter-spacing:2px;color:#22D3B8;">${giftCard.code}</p>
              </td>
            </tr>
          </table>
          <p style="margin:20px 0 0;font-family:Arial,sans-serif;font-size:13px;line-height:1.6;color:#7C8794;">
            Bu kodu <a href="https://aetheraqua.com" style="color:#22D3B8;">aetheraqua.com</a> üzerinden sipariş verirken kupon alanına girerek kullanabilirsiniz.
          </p>
        </td>
      </tr>
    </table>
  </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "AetherAqua <noreply@aetheraqua.com>",
      to: giftCard.recipient_email,
      subject: `${giftCard.purchaser_name} size bir AetherAqua Hediye Kartı gönderdi 🎁`,
      html,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return NextResponse.json({ error: errText }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
