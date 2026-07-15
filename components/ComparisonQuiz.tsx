"use client";

import { useState } from "react";
import Link from "next/link";

type Question = {
  text: string;
  options: { label: string; points: { apollo: number; helios: number } }[];
};

const QUESTIONS: Question[] = [
  {
    text: "Bütçeniz nasıl?",
    options: [
      { label: "Ekonomik, temel ihtiyacı karşılasın yeter", points: { apollo: 0, helios: 2 } },
      { label: "Bütçe esnek, en iyi özellikleri istiyorum", points: { apollo: 2, helios: 0 } },
    ],
  },
  {
    text: "Akvaryumunuzda bitki yoğunluğu nasıl?",
    options: [
      { label: "Az bitkili / sadece balık", points: { apollo: 0, helios: 2 } },
      { label: "Yoğun bitkili / karma akvaryum", points: { apollo: 2, helios: 0 } },
    ],
  },
  {
    text: "Uzaktan/otomatik kontrol sizin için önemli mi?",
    options: [
      { label: "Gerek yok, manuel kademe yeterli", points: { apollo: 0, helios: 2 } },
      { label: "Evet, Wi-Fi ile gün doğumu/batımı istiyorum", points: { apollo: 2, helios: 0 } },
    ],
  },
];

export default function ComparisonQuiz() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({ apollo: 0, helios: 0 });
  const [done, setDone] = useState(false);

  function handleAnswer(points: { apollo: number; helios: number }) {
    const next = { apollo: scores.apollo + points.apollo, helios: scores.helios + points.helios };
    setScores(next);

    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }

  function reset() {
    setStep(0);
    setScores({ apollo: 0, helios: 0 });
    setDone(false);
  }

  const winner = scores.apollo >= scores.helios ? "apollo" : "helios";

  return (
    <div className="rounded-2xl border border-abyss-border bg-abyss-surface p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
        30 Saniyelik Test
      </p>
      <h3 className="mt-2 font-display text-2xl text-ink">Hangisi Size Uygun?</h3>

      {!done ? (
        <div className="mt-6">
          <p className="font-body text-sm text-ink-muted">
            Soru {step + 1} / {QUESTIONS.length}
          </p>
          <p className="mt-2 font-body text-lg text-ink">{QUESTIONS[step].text}</p>
          <div className="mt-4 space-y-3">
            {QUESTIONS[step].options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleAnswer(opt.points)}
                className="block w-full rounded-xl border border-abyss-border px-4 py-3 text-left font-body text-sm text-ink-muted transition-colors hover:border-aqua hover:text-ink"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <p className="font-body text-sm text-ink-muted">Size önerimiz:</p>
          <h4
            className={`mt-1 font-display text-4xl ${
              winner === "apollo" ? "text-apollo-gold" : "text-helios-bronze"
            }`}
          >
            {winner === "apollo" ? "Apollo" : "Helios"}
          </h4>
          <p className="mt-3 font-body text-sm text-ink-muted">
            {winner === "apollo"
              ? "Ayarlanabilir tam spektrum ve Wi-Fi kontrolüyle, yoğun bitkili ya da özenli kurulan akvaryumlar için ideal."
              : "Sabit, güvenilir gündüz ışığıyla, ekonomik ve pratik bir çözüm arayanlar için ideal."}
          </p>
          <div className="mt-5 flex gap-3">
            <Link
              href={`/${winner}`}
              className={`rounded-full px-6 py-2.5 font-body text-sm font-semibold text-abyss transition-transform hover:scale-[1.02] ${
                winner === "apollo" ? "bg-apollo-gold" : "bg-helios-bronze"
              }`}
            >
              {winner === "apollo" ? "Apollo'yu İncele" : "Helios'u İncele"}
            </Link>
            <button
              onClick={reset}
              className="rounded-full border border-abyss-border px-5 py-2.5 font-body text-xs text-ink-muted hover:text-ink"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
