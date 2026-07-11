import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import LegalSection from "@/components/legal/LegalSection";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | AetherAqua",
  description: "AetherAqua Gizlilik Politikası ve KVKK Aydınlatma Metni.",
};

export default function GizlilikPolitikasiPage() {
  return (
    <LegalLayout title="Gizlilik Politikası" lastUpdated="[Tarih girin]">
      <LegalSection title="1. Veri Sorumlusu">
        <p>
          Bu internet sitesi ([Şirket Unvanı] — &quot;AetherAqua&quot;)
          tarafından işletilmektedir. 6698 sayılı Kişisel Verilerin
          Korunması Kanunu (&quot;KVKK&quot;) kapsamında veri sorumlusu
          sıfatıyla [Şirket Unvanı, Adres, Mersis No] hareket etmektedir.
        </p>
      </LegalSection>

      <LegalSection title="2. Toplanan Kişisel Veriler">
        <p>
          Sitemiz üzerinden sipariş verirken ad-soyad, telefon numarası,
          e-posta adresi ve teslimat adresi bilgileriniz tarafımızca
          işlenir. Ayrıca site kullanımına ilişkin teknik veriler
          (IP adresi, tarayıcı bilgisi, çerezler) otomatik olarak
          toplanabilir.
        </p>
      </LegalSection>

      <LegalSection title="3. Verilerin İşlenme Amacı">
        <p>
          Toplanan veriler; sipariş süreçlerinin yürütülmesi, teslimat
          işlemlerinin gerçekleştirilmesi, müşteri destek taleplerinin
          karşılanması ve yasal yükümlülüklerin yerine getirilmesi
          amacıyla işlenir.
        </p>
      </LegalSection>

      <LegalSection title="4. Hukuki Sebep">
        <p>
          Kişisel verileriniz, KVKK m.5/2 kapsamında bir sözleşmenin
          kurulması veya ifasıyla doğrudan doğruya ilgili olması ve
          hukuki yükümlülüğün yerine getirilmesi hukuki sebeplerine
          dayanılarak işlenmektedir.
        </p>
      </LegalSection>

      <LegalSection title="5. Verilerin Saklanma Süresi">
        <p>
          Kişisel verileriniz, ilgili mevzuatta öngörülen süreler
          boyunca (özellikle Vergi Usul Kanunu ve Türk Ticaret Kanunu
          kapsamındaki saklama yükümlülükleri gereğince) saklanır ve bu
          sürelerin sonunda silinir, yok edilir veya anonim hale
          getirilir.
        </p>
      </LegalSection>

      <LegalSection title="6. Üçüncü Taraflarla Paylaşım">
        <p>
          Kişisel verileriniz; kargo/lojistik firmaları, ödeme
          kuruluşları (ör. iyzico/PayTR) ve yasal olarak yetkili kamu
          kurumları ile, yalnızca hizmetin ifası için gerekli olduğu
          ölçüde paylaşılır. Verileriniz pazarlama amacıyla üçüncü
          taraflara satılmaz.
        </p>
      </LegalSection>

      <LegalSection title="7. Çerezler">
        <p>
          Sitemiz, alışveriş sepetinizin hatırlanması gibi temel
          işlevler için tarayıcınızda yerel depolama (localStorage)
          kullanır. Bu veriler yalnızca cihazınızda tutulur ve
          sunucularımıza aktarılmaz.
        </p>
      </LegalSection>

      <LegalSection title="8. KVKK Kapsamındaki Haklarınız">
        <p>KVKK m.11 uyarınca kişisel verilerinize ilişkin olarak:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>İşlenip işlenmediğini öğrenme,</li>
          <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
          <li>Yurt içinde/dışında aktarıldığı üçüncü kişileri bilme,</li>
          <li>Eksik/yanlış işlenmişse düzeltilmesini isteme,</li>
          <li>Silinmesini veya yok edilmesini isteme,</li>
          <li>İşlemeye itiraz etme haklarına sahipsiniz.</li>
        </ul>
        <p>
          Bu haklarınızı kullanmak için [iletişim e-postası] adresinden
          bize ulaşabilirsiniz.
        </p>
      </LegalSection>

      <LegalSection title="9. İletişim">
        <p>
          Gizlilik politikamızla ilgili sorularınız için İletişim
          sayfamızdaki kanallardan bize ulaşabilirsiniz.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
