"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/supabase/storage";
import { useToast } from "@/components/ToastProvider";

export default function AvatarUpload({ userId, fallbackName }: { userId: string; fallbackName: string }) {
  const { showToast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("avatar_url, full_name")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        setAvatarUrl(data?.avatar_url ?? null);
        setFullName(data?.full_name || fallbackName);
      });
  }, [userId, fallbackName]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const url = await uploadImage(file, "avatars");
    if (!url) {
      setUploading(false);
      showToast("Fotoğraf yüklenemedi, tekrar deneyin.", "error");
      return;
    }

    const supabase = createClient();
    await supabase.from("profiles").upsert({ id: userId, avatar_url: url });
    setAvatarUrl(url);
    setUploading(false);
    showToast("Profil fotoğrafı güncellendi", "success");
  }

  const initials = fullName
    .trim()
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="group relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border border-abyss-border bg-abyss-surface"
      >
        {avatarUrl ? (
          <Image src={avatarUrl} alt="Profil fotoğrafı" fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-lg text-ink-muted">
            {initials || "?"}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-abyss/70 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="font-body text-[10px] text-ink">
            {uploading ? "..." : "Değiştir"}
          </span>
        </div>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div>
        <p className="font-body text-sm text-ink">{fullName || "İsimsiz Kullanıcı"}</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="font-body text-xs text-aqua hover:underline"
        >
          Fotoğraf {avatarUrl ? "değiştir" : "ekle"}
        </button>
      </div>
    </div>
  );
}
