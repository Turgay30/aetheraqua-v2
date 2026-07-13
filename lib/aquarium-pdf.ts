import jsPDF from "jspdf";
import { StockingResult, EquipmentRecommendation } from "@/lib/aquarium-calc";

type SelectedFish = { name: string; count: number };

export function buildResultPdfBlob({
  liters,
  selectedFish,
  stocking,
  equipment,
}: {
  liters: number;
  selectedFish: SelectedFish[];
  stocking: StockingResult;
  equipment: EquipmentRecommendation;
}): Blob {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 48;
  let y = 64;

  const levelLabel =
    stocking.level === "rahat" ? "Rahat" : stocking.level === "uygun" ? "Uygun" : "Kalabalık";

  // Başlık şeridi
  doc.setFillColor(11, 18, 32); // #0B1220
  doc.rect(0, 0, pageWidth, 96, "F");
  doc.setTextColor(231, 236, 239); // ink
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("AETHERAQUA", marginX, 48);
  doc.setTextColor(34, 211, 184); // aqua
  doc.text("  Akvaryum Asistanı Sonuçları", marginX + 118, 48);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(124, 135, 148);
  doc.text("Mitolojiden İlham Alan Akvaryum Aydınlatmaları · aetheraqua.com", marginX, 68);

  y = 128;
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`Tank Hacmi: ${liters.toFixed(0)} litre`, marginX, y);

  y += 28;
  doc.setFontSize(12);
  doc.text("Seçilen Canlılar", marginX, y);
  y += 10;
  doc.setDrawColor(220, 220, 220);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  selectedFish.forEach((f) => {
    doc.text(`•  ${f.name}  ×  ${f.count}`, marginX + 8, y);
    y += 18;
  });

  y += 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Stoklama Durumu", marginX, y);
  y += 10;
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Durum: ${levelLabel} (%${stocking.percent.toFixed(0)} doluluk)`, marginX + 8, y);
  y += 24;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Önerilen Ekipman", marginX, y);
  y += 10;
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Filtre debisi: ${equipment.filterFlowLph} L/saat`, marginX + 8, y);
  y += 18;
  doc.text(`Isıtıcı gücü: ${equipment.heaterWatt} W`, marginX + 8, y);

  y += 48;
  doc.setFontSize(9);
  doc.setTextColor(140, 140, 140);
  doc.text(
    "Bu sonuçlar genel bir rehber niteliğindedir; filtrasyon, bitki yoğunluğu ve türe özgü ihtiyaçlar",
    marginX,
    y
  );
  y += 13;
  doc.text("da göz önünde bulundurulmalıdır. — aetheraqua.com/akvaryum-asistani", marginX, y);

  return doc.output("blob");
}

export function buildResultPdfFile(args: Parameters<typeof buildResultPdfBlob>[0]): File {
  const blob = buildResultPdfBlob(args);
  return new File([blob], "aetheraqua-akvaryum-sonuclari.pdf", { type: "application/pdf" });
}
