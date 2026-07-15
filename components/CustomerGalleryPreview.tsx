import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export default async function CustomerGalleryPreview() {
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, reviewer_name, photo_url")
    .not("photo_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(6);

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-ink-faint">Topluluk</p>
          <h2 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            Müşterilerimizin Akvaryumları
          </h2>
        </div>
        <Link
          href="/musteri-galerisi"
          className="hidden whitespace-nowrap font-body text-sm text-aqua hover:underline sm:block"
        >
          Tümünü Gör →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {reviews.map((r) => (
          <div key={r.id} className="relative aspect-square overflow-hidden rounded-xl">
            <Image src={r.photo_url!} alt={r.reviewer_name} fill className="object-cover" />
          </div>
        ))}
      </div>

      <Link
        href="/musteri-galerisi"
        className="mt-6 block text-center font-body text-sm text-aqua hover:underline sm:hidden"
      >
        Tümünü Gör →
      </Link>
    </section>
  );
}
