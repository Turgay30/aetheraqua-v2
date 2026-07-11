export const WHATSAPP_NUMBER = "905070265091";

// TODO: Gerçek e-posta adresinizle değiştirin
export const CONTACT_EMAIL = "info@aetheraqua.com";

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
