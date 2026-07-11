export default function ProductJsonLd({
  name,
  description,
  image,
  price,
  sku,
}: {
  name: string;
  description: string;
  image: string;
  price: number;
  sku: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: `https://aetheraqua.com${image}`,
    sku,
    brand: {
      "@type": "Brand",
      name: "AetherAqua",
    },
    offers: {
      "@type": "Offer",
      url: `https://aetheraqua.com/${sku.toLowerCase()}`,
      priceCurrency: "TRY",
      price,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
