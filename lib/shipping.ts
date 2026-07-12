const CARRIER_TRACKING_URLS: Record<string, string> = {
  "Yurtiçi Kargo": "https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=",
  "Aras Kargo": "https://kargotakip.araskargo.com.tr/mainpage.aspx?code=",
  "MNG Kargo": "https://www.mngkargo.com.tr/gonderitakip?code=",
  "PTT Kargo": "https://gonderitakip.ptt.gov.tr/Track/Verify?q=",
  "Sürat Kargo": "https://www.suratkargo.com.tr/KargoTakip?code=",
};

export const SHIPPING_COMPANIES = Object.keys(CARRIER_TRACKING_URLS);

export function buildTrackingUrl(company: string | null, trackingNumber: string | null): string | null {
  if (!company || !trackingNumber) return null;
  const base = CARRIER_TRACKING_URLS[company];
  if (!base) return null;
  return `${base}${encodeURIComponent(trackingNumber)}`;
}
