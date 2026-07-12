import { createClient } from "@/lib/supabase/client";
import { LivestockType, CompatibilityKey, parseKey } from "@/lib/livestock";

/** Bir canlının tüm uyumsuzluk ilişkilerini siler ve verilen listeyle yeniden (iki yönlü) oluşturur. */
export async function saveCompatibility(
  type: LivestockType,
  id: string,
  incompatibleWith: Set<CompatibilityKey>
) {
  const supabase = createClient();

  // Önce bu canlıya ait tüm eski ilişkileri sil (iki yönde de)
  await supabase
    .from("livestock_compatibility")
    .delete()
    .eq("a_type", type)
    .eq("a_id", id);
  await supabase
    .from("livestock_compatibility")
    .delete()
    .eq("b_type", type)
    .eq("b_id", id);

  if (incompatibleWith.size === 0) return;

  const rows = Array.from(incompatibleWith).flatMap((k) => {
    const other = parseKey(k);
    return [
      { a_type: type, a_id: id, b_type: other.type, b_id: other.id, compatible: false },
      { a_type: other.type, a_id: other.id, b_type: type, b_id: id, compatible: false },
    ];
  });

  await supabase.from("livestock_compatibility").insert(rows);
}

/** Bir canlının mevcut uyumsuzluk ilişkilerini (a tarafı olarak) çeker. */
export async function loadIncompatibleWith(
  type: LivestockType,
  id: string
): Promise<Set<CompatibilityKey>> {
  const supabase = createClient();
  const { data } = await supabase
    .from("livestock_compatibility")
    .select("b_type, b_id")
    .eq("a_type", type)
    .eq("a_id", id);

  return new Set((data ?? []).map((r) => `${r.b_type}:${r.b_id}` as CompatibilityKey));
}
