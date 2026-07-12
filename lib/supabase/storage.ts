import { createClient } from "@/lib/supabase/client";

export async function uploadImage(file: File, folder: string): Promise<string | null> {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const fileName = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("site-images").upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    console.error("Görsel yükleme hatası:", error);
    return null;
  }

  const { data } = supabase.storage.from("site-images").getPublicUrl(fileName);
  return data.publicUrl;
}
