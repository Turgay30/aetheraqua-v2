export default function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AetherAqua",
    url: "https://aetheraqua.com",
    logo: "https://aetheraqua.com/icon.svg",
    description:
      "Mitolojiden ilham alan, profesyonel akvaryum aydınlatmaları: Apollo ve Helios WRGB LED serisi.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
