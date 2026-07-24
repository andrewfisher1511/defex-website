import "server-only";

import { emailButton, emailDefinitionRow, emailHeading, emailParagraph, emailShell, escapeHtml } from "./shell";

const SITE_ORIGIN = () => process.env.NEXT_PUBLIC_SITE_URL || "https://defex.engineering";

function absolute(path: string): string {
  return new URL(path, SITE_ORIGIN()).toString();
}

// ---------------------------------------------------------------------
// Contact — Launch Pack D1.3 (auto-reply) / D1.4 (internal notification)
// ---------------------------------------------------------------------

export interface ContactAutoReplyInput {
  name: string;
}

/** To the enquirer. From enquiries@, Reply-To andrew@ (D1.3). */
export function contactAutoReplyEmail({ name }: ContactAutoReplyInput): { subject: string; html: string } {
  const subject = "Your enquiry has reached DEFEX";
  const firstName = name.trim().split(/\s+/)[0] || "there";

  const html = emailShell({
    preheader: "Thanks for getting in touch — Andrew will reply personally.",
    bodyHtml: [
      emailHeading("Thanks for getting in touch."),
      emailParagraph(
        `Hi ${escapeHtml(firstName)}, your enquiry has reached DEFEX. Andrew reads every message himself ` +
          `and will reply personally, usually within one business day.`
      ),
      emailParagraph(
        `If it's urgent — active water ingress or a safety concern — call ` +
          `<a href="tel:+61432261722" style="color:#2563EB;">0432 261 722</a> directly.`
      ),
      emailParagraph("Andrew Fisher<br>DEFEX Engineering"),
    ].join(""),
  });

  return { subject, html };
}

export interface ContactNotificationInput {
  name: string;
  email: string;
  phone?: string;
  topic?: string;
  message: string;
}

/** To Andrew. From "DEFEX Website", Reply-To the enquirer (D1.4). */
export function contactNotificationEmail({
  name,
  email,
  phone,
  topic,
  message,
}: ContactNotificationInput): { subject: string; html: string } {
  const subject = topic ? `New enquiry — ${name}, ${topic}` : `New enquiry — ${name}`;

  const rows = [
    emailDefinitionRow("Name", escapeHtml(name)),
    emailDefinitionRow("Email", `<a href="mailto:${escapeHtml(email)}" style="color:#2563EB;">${escapeHtml(email)}</a>`),
    phone ? emailDefinitionRow("Phone", `<a href="tel:${escapeHtml(phone)}" style="color:#2563EB;">${escapeHtml(phone)}</a>`) : "",
    topic ? emailDefinitionRow("Topic", escapeHtml(topic)) : "",
  ].join("");

  const html = emailShell({
    preheader: `${name} — ${message.slice(0, 100)}`,
    bodyHtml: [
      emailHeading("New website enquiry"),
      `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">${rows}</table>`,
      `<p style="margin:0 0 6px;font-size:12px;font-weight:600;letter-spacing:0.06em;color:#98A2B3;">MESSAGE</p>`,
      `<p style="margin:0 0 20px;white-space:pre-wrap;">${escapeHtml(message)}</p>`,
      emailParagraph("Reply to this email to reach the enquirer directly."),
    ].join(""),
  });

  return { subject, html };
}

// ---------------------------------------------------------------------
// DBP Hub guide gate — README component map: "writes a lead, source
// 'dbp_guide'". No PDF asset exists yet, so this links to the live guide
// rather than claiming an attachment that doesn't exist.
// ---------------------------------------------------------------------

export interface GuideDeliveryInput {
  name: string;
}

export function guideDeliveryEmail({ name }: GuideDeliveryInput): { subject: string; html: string } {
  const subject = "Your DEFEX guide to the DBP Act";
  const firstName = name.trim().split(/\s+/)[0] || "there";

  const html = emailShell({
    preheader: "The plain-English guide to the Design and Building Practitioners Act 2020.",
    bodyHtml: [
      emailHeading("The DBP Act, explained."),
      emailParagraph(
        `Hi ${escapeHtml(firstName)}, thanks for your interest. The full guide is live on our site any time ` +
          `you or your committee need it — no login required.`
      ),
      emailButton(absolute("/dbp-act#guide"), "Read the guide"),
      emailParagraph(
        `While you're there, the 3-minute check is worth your committee's time too: ` +
          `<a href="${absolute("/dbp-act#quiz")}" style="color:#2563EB;">take it here</a>.`
      ),
    ].join(""),
  });

  return { subject, html };
}

// ---------------------------------------------------------------------
// DBP quiz results — README "Quiz data": identity + score only on
// submitted email.
// ---------------------------------------------------------------------

export interface QuizResultsMissedAssist {
  n: number;
  text: string;
}

export interface QuizResultsInput {
  score: number;
  total: number;
  bandTitle: string;
  bandBlurb: string;
  missedAssists: QuizResultsMissedAssist[];
}

export function quizResultsEmail({
  score,
  total,
  bandTitle,
  bandBlurb,
  missedAssists,
}: QuizResultsInput): { subject: string; html: string } {
  const subject = `Your DBP Act check results: ${score}/${total}`;

  const assistsHtml =
    missedAssists.length > 0
      ? [
          `<p style="margin:24px 0 10px;font-size:12px;font-weight:600;letter-spacing:0.06em;color:#98A2B3;">WHERE DEFEX CAN HELP YOU SPECIFICALLY</p>`,
          ...missedAssists.map(
            (line) =>
              `<p style="margin:0 0 10px;"><strong style="color:#1A1A2E;">${line.n}.</strong> ${escapeHtml(line.text)}</p>`
          ),
        ].join("")
      : "";

  const html = emailShell({
    preheader: `You scored ${score} out of ${total} — ${bandTitle}`,
    bodyHtml: [
      emailHeading(bandTitle),
      emailParagraph(`<strong>You scored ${score} out of ${total}.</strong>`),
      emailParagraph(escapeHtml(bandBlurb)),
      assistsHtml,
      emailButton(absolute("/dbp-act#guide"), "Read the full guide"),
    ].join(""),
  });

  return { subject, html };
}
