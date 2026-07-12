import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DecorativeGlow from "@/components/DecorativeGlow";

async function getPost(slug: string) {
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
  const post = await getPost(params.slug);
  if (!post) return { title: "Yazı Bulunamadı | AetherAqua" };
  return {
    title: `${post.title} | AetherAqua Blog`,
    description: post.excerpt,
    openGraph: post.cover_image ? { images: [{ url: post.cover_image }] } : undefined,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const paragraphs: string[] = post.content.split(/\n\n+/).filter((p: string) => p.trim());

  return (
    <div className="relative overflow-hidden bg-abyss bg-abyss-gradient">
      <DecorativeGlow />
      <article className="relative z-10 mx-auto max-w-2xl px-6 py-20">
        <Link href="/blog" className="font-body text-xs text-aqua hover:underline">
          ← Tüm Yazılar
        </Link>

        <p className="mt-6 font-mono text-[11px] text-ink-faint">
          {new Date(post.created_at).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">{post.title}</h1>

        {post.cover_image && (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
            <Image src={post.cover_image} alt={post.title} fill className="object-cover" priority />
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
