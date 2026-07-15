"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Sessizce yok say — PWA desteği olmasa da site normal çalışmaya devam eder
      });
    }
  }, []);

  return null;
}
