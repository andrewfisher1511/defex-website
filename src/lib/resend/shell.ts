import "server-only";

/**
 * Table-based HTML shell shared by every outbound email — navy header with
 * the lockup, white body, and the Part C email signature verbatim:
 *
 *   DEFEX Engineering Pty Ltd · ABN 31 700 169 580 · PO Box 148, Gymea NSW 2227
 *   This email and any attachments are confidential and may be subject to
 *   copyright. If received in error, please delete and notify the sender.
 *
 * Deliberately plain: tables + inline styles only (no CSS, no flex/grid) —
 * that is what survives Outlook/Gmail/Apple Mail's stripped-down renderers.
 * Font stack falls back to system sans-serif; email clients cannot be
 * relied on to load Inter from Google Fonts.
 */

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/**
 * Canonical public origin for anything embedded IN an email — images, right
 * now. Deliberately NOT NEXT_PUBLIC_SITE_URL: that can be
 * http://localhost:3000 or a Vercel preview URL depending on where the
 * sending code runs, and an email sent from either is read later, by
 * someone else, on a machine that can't reach either. The logo has to
 * resolve from any inbox, at any time, regardless of which environment
 * generated the email — so this is pinned to the one origin that's always
 * real: the live domain.
 */
const EMAIL_ASSET_ORIGIN = "https://defex.engineering";

export function emailAssetUrl(path: string): string {
  return new URL(path, EMAIL_ASSET_ORIGIN).toString();
}

interface EmailShellInput {
  /** Hidden preview text shown next to the subject in most inboxes. */
  preheader: string;
  /** Pre-built inner HTML — build with the small helpers below. */
  bodyHtml: string;
}

export function emailShell({ preheader, bodyHtml }: EmailShellInput): string {
  const logo = emailAssetUrl("/assets/defex-lockup-horizontal-white.png");

  return `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DEFEX Engineering</title>
</head>
<body style="margin:0;padding:0;background:#F9FAFB;font-family:${FONT_STACK};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E4E7EC;">
          <tr>
            <td style="background:#1A1A2E;padding:28px 32px;">
              <img src="${logo}" alt="DEFEX Engineering" height="32" style="display:block;height:32px;width:auto;border:0;">
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px;color:#1C222B;font-size:15px;line-height:1.65;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid #E4E7EC;color:#98A2B3;font-size:11px;line-height:1.6;">
              DEFEX Engineering Pty Ltd &middot; ABN 31 700 169 580 &middot; PO Box 148, Gymea NSW 2227<br>
              This email and any attachments are confidential and may be subject to copyright. If received in error, please delete and notify the sender.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function emailHeading(text: string): string {
  return `<h1 style="margin:0 0 16px;font-size:22px;font-weight:600;letter-spacing:-0.01em;color:#1A1A2E;">${escapeHtml(text)}</h1>`;
}

export function emailParagraph(html: string): string {
  return `<p style="margin:0 0 16px;">${html}</p>`;
}

export function emailButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;">
  <tr>
    <td style="border-radius:8px;background:#2563EB;">
      <a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 26px;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;">${escapeHtml(label)}</a>
    </td>
  </tr>
</table>`;
}

export function emailDefinitionRow(label: string, value: string): string {
  return `<tr>
  <td style="padding:6px 12px 6px 0;font-size:12px;font-weight:600;letter-spacing:0.06em;color:#98A2B3;white-space:nowrap;vertical-align:top;">${escapeHtml(label.toUpperCase())}</td>
  <td style="padding:6px 0;font-size:14.5px;color:#1C222B;vertical-align:top;">${value}</td>
</tr>`;
}
