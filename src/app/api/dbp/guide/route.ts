import { NextResponse, type NextRequest } from "next/server";
import { isNonEmptyString, isValidEmail } from "@/lib/validation";
import { writeLead } from "@/lib/leads/writeLead";
import { sendGuideDeliveryEmail } from "@/lib/resend/send";

/**
 * DbpGuideGate — README component map: "name + email -> reveals guide,
 * writes a lead (source: 'dbp_guide')". The frontend unlocks the guide on
 * valid client-side input regardless of this call's outcome (the guide is
 * free content; only the lead + email side effect depends on the server).
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const { name, email } = (body ?? {}) as Record<string, unknown>;

  const fieldErrors: Record<string, string> = {};
  if (!isNonEmptyString(name, 200)) fieldErrors.name = "Enter your name.";
  if (!isValidEmail(email)) fieldErrors.email = "Enter a valid email address.";

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ ok: false, fieldErrors }, { status: 422 });
  }

  const cleanName = (name as string).trim();

  const lead = await writeLead({ source: "dbp_guide", name: cleanName, email: email as string });
  if (!lead.ok) {
    return NextResponse.json({ ok: false, error: "Could not record your details." }, { status: 502 });
  }

  const result = await sendGuideDeliveryEmail(email as string, cleanName);
  return NextResponse.json({ ok: true, emailSent: result.sent });
}
