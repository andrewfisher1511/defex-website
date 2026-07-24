import { describe, expect, it } from "vitest";
import {
  contactAutoReplyEmail,
  contactNotificationEmail,
  guideDeliveryEmail,
  quizResultsEmail,
} from "./templates";

describe("contactAutoReplyEmail", () => {
  it("uses the exact subject from Launch Pack D1.3", () => {
    const { subject } = contactAutoReplyEmail({ name: "Graeme Client" });
    expect(subject).toBe("Your enquiry has reached DEFEX");
  });

  it("greets by first name and includes the phone number for urgent matters", () => {
    const { html } = contactAutoReplyEmail({ name: "Graeme Client" });
    expect(html).toContain("Hi Graeme,");
    expect(html).toContain("0432 261 722");
  });

  it("escapes a hostile name instead of injecting markup", () => {
    const { html } = contactAutoReplyEmail({ name: '<img src=x onerror=alert(1)>' });
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;img");
  });
});

describe("contactNotificationEmail", () => {
  const base = {
    name: "Graeme Client",
    email: "graeme@example.com",
    message: "Our balconies are leaking.",
  };

  it("matches the Launch Pack D1.4 subject format with a topic", () => {
    const { subject } = contactNotificationEmail({ ...base, topic: "Balcony waterproofing" });
    expect(subject).toBe("New enquiry — Graeme Client, Balcony waterproofing");
  });

  it("falls back to just the name when no topic was given", () => {
    const { subject } = contactNotificationEmail(base);
    expect(subject).toBe("New enquiry — Graeme Client");
  });

  it("includes the enquirer's email, message and a mailto link", () => {
    const { html } = contactNotificationEmail(base);
    expect(html).toContain("graeme@example.com");
    expect(html).toContain("Our balconies are leaking.");
    expect(html).toContain('mailto:graeme@example.com');
  });

  it("escapes a hostile message", () => {
    const { html } = contactNotificationEmail({ ...base, message: "<script>alert(1)</script>" });
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;");
  });
});

describe("guideDeliveryEmail", () => {
  it("links to the guide rather than claiming a PDF attachment that doesn't exist", () => {
    const { html } = guideDeliveryEmail({ name: "Jane Smith" });
    expect(html).toContain("/dbp-act#guide");
    expect(html.toLowerCase()).not.toContain(".pdf");
  });

  it("greets by first name", () => {
    const { html } = guideDeliveryEmail({ name: "Jane Smith" });
    expect(html).toContain("Hi Jane,");
  });
});

describe("quizResultsEmail", () => {
  it("states the score and band title in the subject and body", () => {
    const { subject, html } = quizResultsEmail({
      score: 5,
      total: 8,
      bandTitle: "Solid foundations",
      bandBlurb: "You know more than most committee members.",
      missedAssists: [],
    });
    expect(subject).toBe("Your DBP Act check results: 5/8");
    expect(html).toContain("You scored 5 out of 8");
    expect(html).toContain("Solid foundations");
  });

  it("numbers and includes every missed-question assist line", () => {
    const { html } = quizResultsEmail({
      score: 6,
      total: 8,
      bandTitle: "Solid foundations",
      bandBlurb: "Blurb.",
      missedAssists: [
        { n: 1, text: "First assist string." },
        { n: 2, text: "Second assist string." },
      ],
    });
    expect(html).toContain("1.");
    expect(html).toContain("First assist string.");
    expect(html).toContain("2.");
    expect(html).toContain("Second assist string.");
  });

  it("omits the assists section entirely on a perfect score", () => {
    const { html } = quizResultsEmail({
      score: 8,
      total: 8,
      bandTitle: "Committee ready",
      bandBlurb: "Impressive.",
      missedAssists: [],
    });
    expect(html).not.toContain("WHERE DEFEX CAN HELP");
  });
});
