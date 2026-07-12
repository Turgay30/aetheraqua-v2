import { NextResponse } from "next/server";

type OrderItem = {
  product_name: string;
  size: number;
  color_label: string;
  quantity: number;
  unit_price: number;
};

type OrderPayload = {
  orderNo: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
};

function formatTL(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

function buildEmailHtml(order: OrderPayload): string {
  const itemRows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e5e5e5;color:#1a1a1a;font-size:14px;">
            ${item.product_name} ${item.size}cm (${item.color_label})<br/>
            <span style="color:#888;font-size:13px;">${item.quantity} adet</span>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #e5e5e5;color:#1a1a1a;font-size:14px;text-align:right;">
            ${formatTL(item.unit_price * item.quantity)}
          </td>
        </tr>`
    )
    .join("");

  return `
  <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#0B1220;color:#E7ECEF;">
    <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#22D3B8;margin:0 0 8px;">AetherAqua</p>
    <h1 style="font-size:24px;margin:0 0 24px;color:#fff;">Siparişiniz Alındı</h1>
    <p style="font-size:14px;line-height:1.6;color:#c5cdd6;">
      Merhaba ${order.customerName},<br/><br/>
      <strong>${order.orderNo}</strong> numaralı siparişiniz başarıyla alındı. Aşağıda sipariş detaylarınızı bulabilirsiniz.
    </p>

    <table style="width:100%;border-collapse:collapse;margin-top:20px;">
      ${itemRows}
      <tr>
        <td style="padding:14px 0 0;font-size:15px;font-weight:bold;color:#fff;">Toplam</td>
        <td style="padding:14px 0 0;font-size:15px;font-weight:bold;color:#C9A227;text-align:right;">${formatTL(order.total)}</td>
      </tr>
    </table>

    <p style="margin-top:24px;font-size:13px;color:#8B97A6;">
      Teslimat Adresi:<br/>${order.customerAddress}
    </p>

    <p style="margin-top:32px;font-size:12px;color:#5B6675;">
      Sorularınız için bize <a href="mailto:infoaetheraqua@gmail.com" style="color:#22D3B8;">infoaetheraqua@gmail.com</a> adresinden ulaşabilirsiniz.
    </p>
  </div>`;
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "E-posta servisi yapılandırılmamış." }, { status: 500 });
  }

  const order: OrderPayload = await request.json();

  if (!order.customerEmail || !order.orderNo) {
    return NextResponse.json({ error: "Eksik sipariş bilgisi." }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "AetherAqua <noreply@aetheraqua.com>",
        to: order.customerEmail,
        subject: `Siparişiniz Alındı — ${order.orderNo}`,
        html: buildEmailHtml(order),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: errText }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
