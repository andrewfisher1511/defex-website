import { NextResponse, type NextRequest } from "next/server";
import { cleanOptionalString, isNonEmptyString, isValidEmail } from "@/lib/validation";
import { writeLead } from "@/lib/leads/writeLead";
import { sendContactAutoReply, sendContactNotification } from "@/lib/resend/send";

/**
 * Contact form — Launch Pack D1.3/D1.4's email pair.
 *
 * Deliberately narrow next to form-endpoint-spec.md's full future design
 * (Turnstile, R2 attachments, AI subject line, JWT magic links into DEFEX
 * Command): that spec is explicitly the next-phase build for a page this
 * handoff doesn't include. This is the minimal, honest version — a real
 * lead is recorded and both emails go out; anti-spam and attachments are
 * not implemented.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, phone, topic, message } = (body ?? {}) as Record<string, unknown>;

  const fieldErrors: Record<string, string> = {};
  if (!isNonEmptyString(name, 200)) fieldErrors.name = "Enter your name.";
  if (!isValidEmail(email)) fieldErrors.email = "Enter a valid email address.";
  if (!isNonEmptyString(message, 5000)) fieldErrors.message = "Tell us a little about what's going on.";

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ ok: false, fieldErrors }, { status: 422 });
  }

  const cleanPhone = cleanOptionalString(phone, 40);
  const cleanTopic = cleanOptionalString(topic, 200);

  const lead = await writeLead({
    source: "contact_form",
    name: (name as string).trim(),
    email: email as string,
    phone: cleanPhone,
    topic: cleanTopic,
    message: (message as string).trim(),
  });

  if (!lead.ok) {
    return NextResponse.json(
      { ok: false, error: "Something went wrong sending the enquiry — call or email directly." },
      { status: 502 }
    );
  }

  // The lead is recorded regardless of email delivery — a Resend hiccup
  // (or, right now, no RESEND_API_KEY at all — D1.1 is a manual dashboard
  // step Andrew hasn't done yet) must not make a real enquiry look failed.
  const [autoReply, notification] = await Promise.all([
    sendContactAutoReply(email as string, (name as string).trim()),
    sendContactNotification({
      name: (name as string).trim(),
      email: email as string,
      phone: cleanPhone ?? undefined,
      topic: cleanTopic ?? undefined,
      message: (message as string).trim(),
    }),
  ]);

  return NextResponse.json({
    ok: true,
    autoReplySent: autoReply.sent,
    notificationSent: notification.sent,
  });
}
