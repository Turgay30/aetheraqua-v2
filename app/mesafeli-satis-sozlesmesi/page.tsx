import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import LegalSection from "@/components/legal/LegalSection";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi | AetherAqua",
  description: "AetherAqua Mesafeli Satış Sözleşmesi.",
};

export default function MesafeliSatisSozlesmesiPage() {
  return (
    <LegalLayout title="Mesafeli Satış Sözleşmesi" lastUpdated="[Tarih girin]">
      <LegalSection title="1. Taraflar">
        <p>
          İşbu sözleşme; bir tarafta [Şirket Unvanı, Adres, Vergi No]
          (&quot;SATICI&quot;) ile diğer tarafta siteden alışveriş yapan
          (&quot;ALICI&quot;) arasında, ALICI'nın siparişini onayladığı
          anda elektronik ortamda kurulmuştur.
        </p>
      </LegalSection>

      <LegalSection title="2. Sözleşmenin Konusu">
        <p>
          İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait
          aetheraqua.com internet sitesinden elektronik ortamda
          sipariş verdiği ürünlerin satışı ve teslimi ile ilgili
          olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve
          Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince
          tarafların hak ve yükümlülüklerinin belirlenmesidir.
        </p>
      </LegalSection>

      <LegalSection title="3. Ürün ve Ödeme Bilgileri">
        <p>
          Sipariş edilen ürünün türü, boyutu, kasa rengi, adedi ve
          satış bedeli, sipariş onay ekranında ve ALICI'ya e-posta ile
          gönderilen sipariş özetinde açıkça belirtilir. Ödeme, site
          üzerinde sunulan güvenli ödeme yöntemleriyle gerçekleştirilir.
        </p>
      </LegalSection>

      <LegalSection title="4. Teslimat">
        <p>
          Ürünler, ALICI'nın sipariş sırasında belirttiği adrese, [X]
          iş günü içinde anlaşmalı kargo firması aracılığıyla teslim
          edilir. Teslimat süresi, stok durumuna ve bulunduğunuz
          bölgeye göre değişebilir.
        </p>
      </LegalSection>

      <LegalSection title="5. Cayma Hakkı">
        <p>
          ALICI, ürünü teslim aldığı tarihten itibaren 14 (on dört) gün
          içinde herhangi bir gerekçe göstermeksizin ve cezai şart
          ödemeksizin sözleşmeden cayma hakkına sahiptir. Cayma
          hakkının kullanılması için bu süre içinde SATICI'ya yazılı
          bildirimde bulunulması yeterlidir. Cayma hakkının
          kullanılması halinde, ürünün faturası ve kutusu/ambalajı
          hasarsız şekilde iade edilmelidir.
        </p>
      </LegalSection>

      <LegalSection title="6. Cayma Hakkının Kullanılamayacağı Haller">
        <p>
          Mesafeli Sözleşmeler Yönetmeliği m.15 uyarınca, ALICI'nın
          isteği doğrultusunda kişiselleştirilmiş (özel boy/renk
          kombinasyonuna göre üretilmiş) ürünlerde cayma hakkı
          kullanılamayabilir. Bu durum, ilgili ürün için sipariş
          öncesinde ayrıca belirtilecektir.
        </p>
      </LegalSection>

      <LegalSection title="7. Temerrüt Hali">
        <p>
          ALICI'nın ödeme yükümlülüğünü yerine getirmemesi halinde,
          SATICI yasal yollara başvurma hakkını saklı tutar.
        </p>
      </LegalSection>

      <LegalSection title="8. Uyuşmazlıkların Çözümü">
        <p>
          İşbu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığı'nca
          ilan edilen değere göre ALICI'nın veya SATICI'nın
          yerleşim yerindeki Tüketici Hakem Heyetleri ile Tüketici
          Mahkemeleri yetkilidir.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
