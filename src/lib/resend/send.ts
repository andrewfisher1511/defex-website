import "server-only";

import { ANDREW_EMAIL, FROM_ENQUIRIES, FROM_WEBSITE, sendEmail, type SendEmailResult } from "./client";
import {
  contactAutoReplyEmail,
  contactNotificationEmail,
  guideDeliveryEmail,
  quizResultsEmail,
  type ContactNotificationInput,
  type QuizResultsInput,
} from "./templates";

/** Launch Pack D1.3: auto-reply to the enquirer. */
export function sendContactAutoReply(to: string, name: string): Promise<SendEmailResult> {
  const { subject, html } = contactAutoReplyEmail({ name });
  return sendEmail({ to, from: FROM_ENQUIRIES, replyTo: ANDREW_EMAIL, subject, html });
}

/** Launch Pack D1.4: internal notification, Reply-To the enquirer. */
export function sendContactNotification(input: ContactNotificationInput): Promise<SendEmailResult> {
  const { subject, html } = contactNotificationEmail(input);
  return sendEmail({ to: ANDREW_EMAIL, from: FROM_WEBSITE, replyTo: input.email, subject, html });
}

/** DbpGuideGate — README: "writes a lead (source: 'dbp_guide')". */
export function sendGuideDeliveryEmail(to: string, name: string): Promise<SendEmailResult> {
  const { subject, html } = guideDeliveryEmail({ name });
  return sendEmail({ to, from: FROM_ENQUIRIES, replyTo: ANDREW_EMAIL, subject, html });
}

/** DbpQuiz results — optional email capture after finishing the check. */
export function sendQuizResultsEmail(to: string, input: QuizResultsInput): Promise<SendEmailResult> {
  const { subject, html } = quizResultsEmail(input);
  return sendEmail({ to, from: FROM_ENQUIRIES, replyTo: ANDREW_EMAIL, subject, html });
}
