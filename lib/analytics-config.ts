// TODO: Gerçek GA4 Ölçüm Kimliğinizle değiştirin (Google Analytics > Yönetici > Veri Akışları)
export const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

// TODO: Gerçek Meta (Facebook) Pixel ID'nizle değiştirin (Meta Events Manager)
export const META_PIXEL_ID = "0000000000000000";

// Bu ID'ler placeholder olduğu için, gerçek değerler girilene kadar
// script'ler yüklenmez (aşağıdaki isConfigured kontrolleri).
export const isGaConfigured = GA_MEASUREMENT_ID !== "G-XXXXXXXXXX";
export const isPixelConfigured = META_PIXEL_ID !== "0000000000000000";
