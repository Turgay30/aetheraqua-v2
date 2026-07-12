import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST() {
  // 1) İsteği yapan kullanıcının kim olduğunu, normal (yetkisi sınırlı) sunucu
  //    istemcisiyle doğrula — bu adım sahte/başkası adına silme isteğini engeller.
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.json({ error: "Hesap silme şu anda yapılandırılmamış." }, { status: 500 });
  }

  // 2) Sadece bu adımda, doğrulanmış kullanıcının KENDİ id'siyle,
  //    yönetici yetkili istemciyle hesabı sil.
  const admin = createAdminClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
