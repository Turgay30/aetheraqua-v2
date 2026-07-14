"use client";

import { useEffect, useRef, useState } from "react";
import { kelvinToRgb, kelvinLabel } from "@/lib/kelvin-color";
import { useToast } from "@/components/ToastProvider";

export default function AquariumLightPreview({
  minKelvin = 6500,
  maxKelvin = 18000,
  accent = "#D4A343",
}: {
  minKelvin?: number;
  maxKelvin?: number;
  accent?: string;
}) {
  const { showToast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hasImage, setHasImage] = useState(false);
  const [kelvin, setKelvin] = useState(Math.round((minKelvin + maxKelvin) / 2));

  function draw() {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const { r, g, b } = kelvinToRgb(kelvin);
    ctx.globalCompositeOperation = "overlay";
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Hafif bir renk-yıkama katmanı daha, daha dolgun bir ışık hissi için
    ctx.globalCompositeOperation = "soft-light";
    ctx.globalAlpha = 0.35;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  }

  // Canvas elemanı ancak hasImage true olunca DOM'a giriyor — bu yüzden çizim,
  // hem hasImage hem kelvin değiştiğinde, canvas kesin var olduktan SONRA çalışmalı.
  useEffect(() => {
    if (hasImage) draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasImage, kelvin]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      // Canvas boyutlarını burada saklayıp, canvas DOM'a girdikten sonra
      // useEffect içinde uygulayacağız.
      setPendingSize({ width: img.width, height: img.height });
      setHasImage(true);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      showToast("Fotoğraf yüklenirken bir sorun oluştu, farklı bir dosya deneyin.", "error");
    };
    img.src = url;
  }

  const [pendingSize, setPendingSize] = useState<{ width: number; height: number } | null>(null);

  // Canvas artık DOM'da — boyutlarını ayarla ve ilk çizimi yap
  useEffect(() => {
    if (!hasImage || !pendingSize) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const maxWidth = 640;
    const scale = Math.min(1, maxWidth / pendingSize.width);
    canvas.width = pendingSize.width * scale;
    canvas.height = pendingSize.height * scale;
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasImage, pendingSize]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `aetheraqua-onizleme-${kelvin}K.png`;
    link.click();
    showToast("Görsel indirildi ✓", "success");
  }

  return (
    <div className="rounded-2xl border border-abyss-border bg-abyss-surface p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
        ✨ Kendi Akvaryumunuzda Deneyin
      </p>
      <p className="mt-2 font-body text-sm text-ink-muted">
        Tankınızın bir fotoğrafını yükleyin, kaydırıcıyla Apollo&apos;nun farklı renk
        sıcaklıklarında nasıl görüneceğini canlı olarak görün.
      </p>

      {!hasImage && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="mt-5 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-abyss-border py-12 transition-colors hover:border-gold"
        >
          <span className="text-3xl">📷</span>
          <span className="font-body text-sm text-ink-muted">Fotoğraf Yükle</span>
        </button>
      )}

      {/* Canvas her zaman DOM'da tutulur (ref kaybolmasın diye), sadece görünürlüğü değişir */}
      <div className={hasImage ? "mt-5" : "hidden"}>
        <div className="overflow-hidden rounded-xl bg-abyss">
          <canvas ref={canvasRef} className="w-full" />
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <span className="font-display text-lg text-ink">
              {kelvin.toLocaleString("tr-TR")}K
            </span>
            <span className="font-body text-xs text-ink-faint">{kelvinLabel(kelvin)}</span>
          </div>
          <input
            type="range"
            min={minKelvin}
            max={maxKelvin}
            step={100}
            value={kelvin}
            onChange={(e) => setKelvin(Number(e.target.value))}
            className="mt-2 w-full"
            style={{ accentColor: accent }}
          />
          <div className="mt-1 flex justify-between font-mono text-[9px] text-ink-faint">
            <span>{minKelvin.toLocaleString("tr-TR")}K</span>
            <span>{maxKelvin.toLocaleString("tr-TR")}K</span>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={handleDownload}
            className="rounded-full border border-abyss-border px-5 py-2 font-body text-xs text-ink-muted transition-colors hover:border-gold hover:text-gold"
          >
            📥 Görseli İndir
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full border border-abyss-border px-5 py-2 font-body text-xs text-ink-muted transition-colors hover:border-gold hover:text-gold"
          >
            Farklı Fotoğraf Dene
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
