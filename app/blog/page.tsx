import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import DecorativeGlow from "@/components/DecorativeGlow";

export const metadata: Metadata = {
  title: "Blog | AetherAqua",
  description: "Akvaryum aydınlatması, su altı bitkileri ve balık bakımı üzerine rehberler.",
};

export const revalidate = 60;

async function getPosts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug, title, excerpt, cover_image, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="relative overflow-hidden bg-abyss bg-abyss-gradient">
      <DecorativeGlow />
      <section className="relative z-10 mx-auto max-w-4xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-aqua">Blog</p>
        <h1 className="mt-4 font-display text-5xl text-ink md:text-6xl">Rehberler</h1>
        <p className="mt-4 max-w-xl font-body text-base text-ink-muted">
          Akvaryum aydınlatması, su altı bitkileri ve balık bakımı üzerine yazılar.
        </p>

        {posts.length === 0 ? (
          <p className="mt-12 font-body text-sm text-ink-muted">Henüz yazı yayınlanmadı.</p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-2xl border border-abyss-border bg-abyss-surface transition-transform hover:-translate-y-1"
              >
                {post.cover_image && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                )}
                <div className="p-6">
                  <p className="font-mono text-[11px] text-ink-faint">
                    {new Date(post.created_at).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <h2 className="mt-2 font-display text-xl text-ink">{post.title}</h2>
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-2 font-body text-sm text-ink-muted">{post.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
