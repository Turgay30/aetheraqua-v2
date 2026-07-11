export const WHATSAPP_NUMBER = "905070265091";

// Gerçek e-posta adresi
export const CONTACT_EMAIL = "infoaetheraqua@gmail.com";

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
