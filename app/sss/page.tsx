import type { Metadata } from "next";
import DecorativeGlow from "@/components/DecorativeGlow";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular | AetherAqua",
  description:
    "Kargo, iade, garanti ve ürün kullanımı hakkında sıkça sorulan sorular ve cevapları.",
};

const FAQ_ITEMS = [
  {
    question: "Kargo ne kadar sürede geliyor?",
    answer:
      "Siparişiniz onaylandıktan sonra genellikle 1-3 iş günü içinde kargoya verilir. Kargo firması ve şehrinize bağlı olarak teslimat 1-4 iş günü daha sürebilir. Sipariş kargoya verildiğinde takip numaranızı Hesabım sayfanızdan ve e-posta ile görebilirsiniz.",
  },
  {
    question: "İade veya değişim yapabilir miyim?",
    answer:
      "Mesafeli Satış Sözleşmesi kapsamında, ürünü teslim aldığınız tarihten itibaren 14 gün içinde herhangi bir gerekçe göstermeden cayma hakkınızı kullanabilirsiniz. Ürünün kullanılmamış ve orijinal ambalajında olması gerekir.",
  },
  {
    question: "Ürünlerin garantisi var mı?",
    answer:
      "Tüm AetherAqua ürünleri Türk Tüketici Hukuku kapsamında 2 yıl yasal garanti ile satılmaktadır. Garanti kapsamındaki bir arıza durumunda bizimle iletişime geçmeniz yeterli.",
  },
  {
    question: "Ürünler su altında güvenli mi?",
    answer:
      "Evet. Apollo IP67, Helios IP65 su geçirmezlik sınıfına sahiptir — akvaryum ortamında sürekli nem ve su teması için tasarlanmıştır. Yine de doğrudan suya tam daldırma önerilmez, ürünün akvaryumun üst kısmına monte edilmesi tasarlanan kullanım şeklidir.",
  },
  {
    question: "Kurulumu zor mu?",
    answer:
      "Hayır. Ürünler standart akvaryum üstü montaj braketleriyle geliyor, ek bir alet veya profesyonel kurulum gerektirmez. Apollo için Wi-Fi bağlantısı uygulamadan birkaç dakikada tamamlanır.",
  },
  {
    question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
    answer:
      "Şu an için sipariş sonrası ekibimiz sizinle ödeme detaylarını netleştirmek üzere iletişime geçiyor. Online kredi kartı ile anlık ödeme altyapımız yakında aktif olacak.",
  },
  {
    question: "Toptan satış yapıyor musunuz?",
    answer:
      "Evet. Akvaryum mağazası, petshop veya distribütörseniz Toptan Satış sayfamızdan bize ulaşabilirsiniz, size özel bir fiyatlandırma hazırlayalım.",
  },
  {
    question: "Hangi boy seçenekleri mevcut?",
    answer:
      "Apollo ve Helios, 30cm'den 120cm'ye kadar 10 farklı boy seçeneğiyle sunulmaktadır. Akvaryum Asistanı'nı kullanarak tankınıza en uygun boyu ve kurulumu bulabilirsiniz.",
  },
];

export default function SssPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className="relative overflow-hidden bg-abyss bg-abyss-gradient">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DecorativeGlow />
      <section className="relative z-10 mx-auto max-w-2xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-aqua">Yardım</p>
        <h1 className="mt-4 font-display text-5xl text-ink md:text-6xl">Sıkça Sorulan Sorular</h1>
        <div className="mt-10">
          <FaqAccordion items={FAQ_ITEMS} />
        </div>
      </section>
    </div>
  );
}
