/**
 * Renk sıcaklığını (Kelvin) gerçekçi bir RGB rengine çevirir — Tanner Helland
 * algoritmasının yaklaşık hali. Fotoğraf üzerine ışık simülasyonu için kullanılır.
 */
export function kelvinToRgb(kelvin: number): { r: number; g: number; b: number } {
  const temp = kelvin / 100;
  let r: number, g: number, b: number;

  if (temp <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(temp) - 161.1195681661;
  } else {
    r = 329.698727446 * Math.pow(temp - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(temp - 60, -0.0755148492);
  }

  if (temp >= 66) {
    b = 255;
  } else if (temp <= 19) {
    b = 0;
  } else {
    b = 138.5177312231 * Math.log(temp - 10) - 305.0447927307;
  }

  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return { r: clamp(r), g: clamp(g), b: clamp(b) };
}

export function kelvinLabel(kelvin: number): string {
  if (kelvin < 7000) return "Sıcak Beyaz — Rahatlatıcı";
  if (kelvin < 10000) return "Gündüz Beyazı — Doğal";
  if (kelvin < 14000) return "Parlak Beyaz — Canlı";
  return "Derin Mavi — Mercan Uyarıcı";
}
