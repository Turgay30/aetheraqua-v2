import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DecorativeGlow from "@/components/DecorativeGlow";

async function getGuide(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const guide = await getGuide(params.slug);
  if (!guide) return { title: "Rehber Bulunamadı | AetherAqua" };
  return {
    title: `${guide.title} | Akvaryum Kütüphanesi`,
    description: guide.excerpt,
    openGraph: guide.cover_image ? { images: [{ url: guide.cover_image }] } : undefined,
  };
}

export default async function GuideDetailPage({ params }: { params: { slug: string } }) {
  const guide = await getGuide(params.slug);
  if (!guide) notFound();

  const paragraphs: string[] = guide.content.split(/\n\n+/).filter((p: string) => p.trim());

  return (
    <div className="relative overflow-hidden bg-abyss bg-abyss-gradient">
      <DecorativeGlow />
      <article className="relative z-10 mx-auto max-w-2xl px-6 py-20">
        <Link href="/akvaryum-kutuphanesi" className="font-body text-xs text-aqua hover:underline">
          ← Kütüphaneye Dön
        </Link>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-aqua">Rehber</p>
        <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">{guide.title}</h1>

        {guide.cover_image && (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
            <Image src={guide.cover_image} alt={guide.title} fill className="object-cover" priority />
          </div>
        )}

        <div className="mt-8 space-y-5">
          {paragraphs.map((p, i) => (
            <p key={i} className="font-body text-[15px] leading-relaxed text-ink-muted">
              {p}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}
