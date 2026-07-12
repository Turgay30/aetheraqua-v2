"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DebugPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const [fishResult, setFishResult] = useState<string>("Yükleniyor...");
  const [productsResult, setProductsResult] = useState<string>("Yükleniyor...");

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("fish_species")
      .select("id, name")
      .then(({ data, error }) => {
        if (error) setFishResult(`HATA: ${error.message} (kod: ${error.code})`);
        else setFishResult(`${data.length} balık bulundu: ${data.map((f) => f.name).join(", ")}`);
      });

    supabase
      .from("products")
      .select("product_id, name, base_price")
      .then(({ data, error }) => {
        if (error) setProductsResult(`HATA: ${error.message} (kod: ${error.code})`);
        else setProductsResult(`${data.length} ürün bulundu: ${JSON.stringify(data)}`);
      });
  }, []);

  return (
    <div className="mx-auto max-w-xl px-6 py-16 font-mono text-xs text-ink">
      <h1 className="font-display text-2xl text-ink mb-6">Teşhis Sayfası (Geçici)</h1>

      <p className="mb-2">
        <span className="text-ink-faint">NEXT_PUBLIC_SUPABASE_URL:</span>
        <br />
        <span className={url ? "text-emerald-400" : "text-red-400"}>
          {url ? url : "TANIMLI DEĞİL (undefined)"}
        </span>
      </p>

      <p className="mb-6">
        <span className="text-ink-faint">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
        <br />
        <span className={key ? "text-emerald-400" : "text-red-400"}>
          {key ? `${key.slice(0, 20)}... (${key.length} karakter)` : "TANIMLI DEĞİL (undefined)"}
        </span>
      </p>

      <p className="mb-2">
        <span className="text-ink-faint">fish_species canlı sorgu sonucu:</span>
        <br />
        <span className={fishResult.startsWith("HATA") ? "text-red-400" : "text-emerald-400"}>
          {fishResult}
        </span>
      </p>

      <p className="mb-6">
        <span className="text-ink-faint">products canlı sorgu sonucu:</span>
        <br />
        <span className={productsResult.startsWith("HATA") ? "text-red-400" : "text-emerald-400"}>
          {productsResult}
        </span>
      </p>

      <p className="mt-6 text-ink-muted">
        Yukarıdakiler yeşilse ve balık/ürün gösteriyorsa, veri erişimi sorunsuz demektir —
        sorun panel arayüzünde. Kırmızıysa, hata mesajını buradan görebiliriz.
      </p>
    </div>
  );
}

