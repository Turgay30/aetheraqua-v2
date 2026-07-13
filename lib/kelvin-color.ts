/**
 * Renk sıcaklığını (Kelvin) yaklaşık bir RGB rengine çevirir — Tanner Helland
 * algoritmasının basitleştirilmiş hali. Işık programı zaman çizelgesinde her
 * fazın gerçek rengini göstermek için kullanılır.
 */
export function kelvinToRgb(kelvin: number): string {
  if (kelvin <= 0) return "#0B1220";

  const temp = kelvin / 100;
  let r: number, g: number, b: number;

  if (temp <= 66) {
    r = 255;
    g = 99.47 * Math.log(temp) - 161.12;
  } else {
    r = 329.7 * Math.pow(temp - 60, -0.1332);
    g = 288.12 * Math.pow(temp - 60, -0.0755);
  }

  if (temp >= 66) {
    b = 255;
  } else if (temp <= 19) {
    b = 0;
  } else {
    b = 138.52 * Math.log(temp - 10) - 305.04;
  }

  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `rgb(${clamp(r)}, ${clamp(g)}, ${clamp(b)})`;
}
