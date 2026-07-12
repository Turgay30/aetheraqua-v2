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
  subtotal: number;
  couponCode?: string | null;
  couponDiscount?: number;
  total: number;
};

function formatTL(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

function buildEmailHtml(order: OrderPayload): string {
  const firstName = order.customerName.split(" ")[0] || order.customerName;

  const itemRows = order.items
    .map(
      (item, i) => `
        <tr>
          <td style="padding:16px 0;border-bottom:1px solid #1E2A3A;">
            <p style="margin:0;font-family:Georgia,serif;font-size:15px;color:#E7ECEF;">${item.product_name} · ${item.size}cm</p>
            <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.3px;color:#7C8794;">${item.color_label} · ${item.quantity} adet</p>
          </td>
          <td style="padding:16px 0;border-bottom:1px solid #1E2A3A;text-align:right;vertical-align:top;">
            <p style="margin:0;font-family:Georgia,serif;font-size:15px;color:#E7ECEF;white-space:nowrap;">${formatTL(item.unit_price * item.quantity)}</p>
          </td>
        </tr>${i === 0 ? "" : ""}`
    )
    .join("");

  const hasDiscount = !!order.couponDiscount && order.couponDiscount > 0;

  return `<!DOCTYPE html>
<html lang="tr">
<body style="margin:0;padding:0;background-color:#060A10;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#060A10;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#0B1220;border:1px solid #1E2A3A;border-radius:16px;overflow:hidden;">

          <!-- Üst şerit -->
          <tr>
            <td style="background:linear-gradient(90deg,#0B1220,#101B2C);padding:36px 40px 28px;border-bottom:1px solid #1E2A3A;">
              <p style="margin:0;font-family:Georgia,serif;font-size:22px;letter-spacing:0.5px;">
                <span style="color:#E7ECEF;">AETHER</span><span style="color:#22D3B8;">AQUA</span>
              </p>
              <p style="margin:6px 0 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7C8794;">
                Mitolojiden İlham Alan Akvaryum Aydınlatmaları
              </p>
            </td>
          </tr>

          <!-- Onay mesajı -->
          <tr>
            <td style="padding:36px 40px 8px;">
              <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#22D3B8;">
                Sipariş Onayı
              </p>
              <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:26px;color:#ffffff;font-weight:normal;">
                Teşekkürler, ${firstName}
              </h1>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#A6B0BC;">
                Siparişiniz alındı ve hazırlanmak üzere kuyruğa girdi. Kargoya verildiğinde ayrıca bilgilendirileceksiniz.
              </p>
            </td>
          </tr>

          <!-- Sipariş no rozeti -->
          <tr>
            <td style="padding:20px 40px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#101B2C;border:1px solid #22D3B8;border-radius:10px;padding:10px 18px;">
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;color:#7C8794;">SİPARİŞ NO</p>
                    <p style="margin:2px 0 0;font-family:Georgia,serif;font-size:16px;color:#22D3B8;">${order.orderNo}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Ürünler -->
          <tr>
            <td style="padding:28px 40px 0;">
              <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7C8794;">
                Sipariş Detayı
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${itemRows}
              </table>
            </td>
          </tr>

          <!-- Toplamlar -->
          <tr>
            <td style="padding:0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
                <tr>
                  <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#7C8794;">Ara Toplam</td>
                  <td style="padding:6px 0;text-align:right;font-family:Arial,sans-serif;font-size:13px;color:#A6B0BC;">${formatTL(order.subtotal)}</td>
                </tr>
                ${
                  hasDiscount
                    ? `<tr>
                  <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#22D3B8;">Kupon (${order.couponCode})</td>
                  <td style="padding:6px 0;text-align:right;font-family:Arial,sans-serif;font-size:13px;color:#22D3B8;">−${formatTL(order.couponDiscount!)}</td>
                </tr>`
                    : ""
                }
                <tr>
                  <td style="padding:14px 0 4px;font-family:Georgia,serif;font-size:17px;color:#ffffff;border-top:1px solid #1E2A3A;">Toplam</td>
                  <td style="padding:14px 0 4px;text-align:right;font-family:Georgia,serif;font-size:19px;color:#C9A227;border-top:1px solid #1E2A3A;">${formatTL(order.total)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Teslimat adresi -->
          <tr>
            <td style="padding:28px 40px 0;">
              <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7C8794;">
                Teslimat Adresi
              </p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;line-height:1.7;color:#A6B0BC;">
                ${order.customerAddress}
              </p>
            </td>
          </tr>

          <!-- Alt bilgi -->
          <tr>
            <td style="padding:36px 40px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #1E2A3A;padding-top:24px;">
                <tr><td style="padding-top:24px;">
                  <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:13px;color:#A6B0BC;">
                    Sorularınız için buradayız
                  </p>
                  <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;">
                    <a href="mailto:infoaetheraqua@gmail.com" style="color:#22D3B8;text-decoration:none;">infoaetheraqua@gmail.com</a>
                  </p>
                  <p style="margin:20px 0 0;font-family:Arial,sans-serif;font-size:11px;color:#5B6675;">
                    © ${new Date().getFullYear()} AetherAqua · aetheraqua.com
                  </p>
                </td></tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
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
