import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GATE_ROUTE } from "@/lib/auth/access";

/**
 * Sign out.
 *
 * POST only, and reached from a real <form>. A GET sign-out can be fired by
 * any third-party <img>/link and by link prefetchers, which logs people out
 * without them asking.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.auth.signOut();
  }

  return NextResponse.redirect(new URL(GATE_ROUTE, request.url), {
    // 303: turn the POST into a GET for the redirect target.
    status: 303,
  });
}
