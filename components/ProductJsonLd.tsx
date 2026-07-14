export default function ProductJsonLd({
  name,
  description,
  image,
  price,
  sku,
  rating,
  url,
}: {
  name: string;
  description: string;
  image: string;
  price: number;
  sku: string;
  rating?: { average: number; count: number };
  url?: string;
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
      url: url ?? `https://aetheraqua.com/${sku.toLowerCase()}`,
      priceCurrency: "TRY",
      price,
      availability: "https://schema.org/InStock",
    },
    ...(rating && rating.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.average.toFixed(1),
            reviewCount: rating.count,
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
