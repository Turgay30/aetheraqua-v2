// TODO: Gerçek WhatsApp iş numarasıyla değiştirin (ülke kodu ile, boşluksuz — örn. "905XXXXXXXXX")
export const WHATSAPP_NUMBER = "905XXXXXXXXX";

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
