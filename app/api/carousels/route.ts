import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const collectionId = searchParams.get("collection_id");

  let query = supabase
    .from("carousels")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  if (collectionId) {
    query = query.eq("collection_id", collectionId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }

  const body = await request.json();

  const insertData = {
    user_id: user.id,
    title: body.title || "Sem titulo",
    topic: body.topic || null,
    post_style: body.post_style || "minimalista",
    slide_count: body.slide_count || 1,
    thumbnail: body.thumbnail || null,
    collection_id: body.collection_id || null,
    slides_data: body.slides_data || null,
  };

  const { data, error } = await supabase
    .from("carousels")
    .insert(insertData as never)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
