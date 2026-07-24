import "server-only";

import { Resend } from "resend";

/**
 * Launch Pack D1 sender identities. Both are send-only addresses on
 * defex.engineering — no mailbox needed, only DKIM/SPF/DMARC (D1.1).
 *
 * "Never no-reply@ — a consultancy should invite replies" (D1.3) is why
 * every send below carries a real Reply-To, never omits one.
 */
export const FROM_ENQUIRIES = "DEFEX Engineering <enquiries@defex.engineering>";
export const FROM_WEBSITE = "DEFEX Website <enquiries@defex.engineering>";
export const ANDREW_EMAIL = "andrew@defex.engineering";

export interface SendEmailInput {
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  html: string;
}

export interface SendEmailResult {
  sent: boolean;
  /**
   * True when RESEND_API_KEY is unset. Expected in every environment until
   * Launch Pack D1.1 (domain + DKIM/SPF/DMARC verification, a dashboard
   * step) is done — the call is logged instead of dispatched so nothing
   * throws and every other part of a flow (DB write, UI state) still runs
   * and is testable.
   */
  stubbed: boolean;
  error?: string;
}

let cachedClient: Resend | null | undefined;

function getClient(): Resend | null {
  if (cachedClient !== undefined) return cachedClient;
  const apiKey = process.env.RESEND_API_KEY;
  cachedClient = apiKey ? new Resend(apiKey) : null;
  return cachedClient;
}

/**
 * Sends one email via Resend, or logs it and returns `stubbed: true` if
 * RESEND_API_KEY isn't set. Callers should generally not fail their whole
 * request just because a notification email didn't go out — see each
 * route handler for how the result is used.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const resend = getClient();

  if (!resend) {
    console.log("[resend] RESEND_API_KEY not set — stubbing send:", {
      to: input.to,
      from: input.from,
      replyTo: input.replyTo,
      subject: input.subject,
    });
    return { sent: false, stubbed: true };
  }

  const { error } = await resend.emails.send({
    from: input.from,
    to: input.to,
    replyTo: input.replyTo,
    subject: input.subject,
    html: input.html,
  });

  if (error) {
    console.error("[resend] send failed:", error.message, { to: input.to, subject: input.subject });
    return { sent: false, stubbed: false, error: error.message };
  }

  return { sent: true, stubbed: false };
}
