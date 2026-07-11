import { buildWhatsAppLink } from "@/lib/contact";

type Theme = "apollo" | "helios";

const themeStyles: Record<Theme, string> = {
  apollo: "border-apollo-gold/30 text-apollo-gold hover:bg-apollo-gold/10",
  helios: "border-helios-bronze/30 text-helios-bronze hover:bg-helios-bronze/10",
};

export default function WhatsAppButton({
  theme,
  productName,
}: {
  theme: Theme;
  productName: string;
}) {
  return (
    <a
      href={buildWhatsAppLink(`Merhaba, ${productName} hakkında bilgi almak istiyorum.`)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-body text-sm transition-colors ${themeStyles[theme]}`}
    >
      <WhatsAppIcon />
      WhatsApp&apos;tan Hızlı Bilgi Al
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 004.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.03h-.01a8.2 8.2 0 01-4.18-1.14l-.3-.18-3.14.82.84-3.06-.2-.32a8.16 8.16 0 01-1.26-4.36c0-4.52 3.68-8.19 8.21-8.19 2.19 0 4.25.85 5.8 2.4a8.14 8.14 0 012.4 5.8c0 4.52-3.68 8.23-8.16 8.23zm4.5-6.15c-.25-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.04 0 1.2.88 2.36 1 2.53.12.16 1.73 2.64 4.19 3.7.58.25 1.04.4 1.4.51.59.19 1.12.16 1.55.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
    </svg>
  );
}
