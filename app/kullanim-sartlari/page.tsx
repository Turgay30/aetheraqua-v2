import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import LegalSection from "@/components/legal/LegalSection";

export const metadata: Metadata = {
  title: "Kullanım Şartları | AetherAqua",
  description: "AetherAqua internet sitesi kullanım şartları.",
};

export default function KullanimSartlariPage() {
  return (
    <LegalLayout title="Kullanım Şartları" lastUpdated="[Tarih girin]">
      <LegalSection title="1. Genel Hükümler">
        <p>
          aetheraqua.com internet sitesini kullanarak işbu kullanım
          şartlarını kabul etmiş sayılırsınız. SATICI, bu şartları
          önceden bildirmeksizin güncelleme hakkını saklı tutar.
        </p>
      </LegalSection>

      <LegalSection title="2. Fikri Mülkiyet">
        <p>
          Sitede yer alan tüm marka, logo, görsel, metin ve tasarım
          unsurları AetherAqua'ya aittir ve izinsiz kullanılamaz,
          çoğaltılamaz veya dağıtılamaz.
        </p>
      </LegalSection>

      <LegalSection title="3. Akvaryum Asistanı Aracı Hakkında">
        <p>
          Sitede yer alan Akvaryum Asistanı aracı, genel akvaryumculuk
          pratiklerine dayanan bilgilendirici öneriler sunar. Balık
          uyumluluğu, stoklama ve ekipman önerileri kesin bilimsel
          garanti taşımaz; özel durumlarda bir akvaryumculuk uzmanına
          danışmanız önerilir.
        </p>
      </LegalSection>

      <LegalSection title="4. Kullanıcı Yükümlülükleri">
        <p>
          Site üzerinden sipariş verirken doğru ve güncel bilgi
          sağlamak kullanıcının sorumluluğundadır. Siteyi kötüye
          kullanım (yetkisiz erişim, otomatik veri toplama vb.)
          yasaktır.
        </p>
      </LegalSection>

      <LegalSection title="5. Sorumluluğun Sınırlandırılması">
        <p>
          SATICI, sitenin kesintisiz veya hatasız çalışacağını garanti
          etmez. Sitenin kullanımından doğabilecek dolaylı zararlardan
          SATICI sorumlu tutulamaz.
        </p>
      </LegalSection>

      <LegalSection title="6. Uygulanacak Hukuk">
        <p>
          İşbu kullanım şartları Türkiye Cumhuriyeti kanunlarına
          tabidir.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
