import { describe, expect, it, vi, beforeEach } from "vitest";

const { sendEmailMock } = vi.hoisted(() => ({
  sendEmailMock: vi.fn().mockResolvedValue({ sent: true, stubbed: false }),
}));

vi.mock("./client", async () => {
  const actual = await vi.importActual<typeof import("./client")>("./client");
  return { ...actual, sendEmail: sendEmailMock };
});

import { ANDREW_EMAIL, FROM_ENQUIRIES, FROM_WEBSITE } from "./client";
import {
  sendContactAutoReply,
  sendContactNotification,
  sendGuideDeliveryEmail,
  sendQuizResultsEmail,
} from "./send";

beforeEach(() => {
  sendEmailMock.mockClear();
});

describe("sendContactAutoReply (Launch Pack D1.3)", () => {
  it("sends from enquiries@, replies to andrew@, to the enquirer", async () => {
    await sendContactAutoReply("graeme@example.com", "Graeme Client");

    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    const call = sendEmailMock.mock.calls[0][0];
    expect(call.to).toBe("graeme@example.com");
    expect(call.from).toBe(FROM_ENQUIRIES);
    expect(call.replyTo).toBe(ANDREW_EMAIL);
    expect(call.subject).toBe("Your enquiry has reached DEFEX");
  });
});

describe("sendContactNotification (Launch Pack D1.4)", () => {
  it("sends from DEFEX Website, to Andrew, Reply-To the enquirer", async () => {
    await sendContactNotification({
      name: "Graeme Client",
      email: "graeme@example.com",
      message: "Balconies are leaking.",
    });

    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    const call = sendEmailMock.mock.calls[0][0];
    expect(call.to).toBe(ANDREW_EMAIL);
    expect(call.from).toBe(FROM_WEBSITE);
    // The whole point of D1.4: hitting Reply goes straight to the client.
    expect(call.replyTo).toBe("graeme@example.com");
  });
});

describe("sendGuideDeliveryEmail", () => {
  it("sends from enquiries@, replies to andrew@, to the requester", async () => {
    await sendGuideDeliveryEmail("jane@example.com", "Jane Smith");

    const call = sendEmailMock.mock.calls[0][0];
    expect(call.to).toBe("jane@example.com");
    expect(call.from).toBe(FROM_ENQUIRIES);
    expect(call.replyTo).toBe(ANDREW_EMAIL);
  });
});

describe("sendQuizResultsEmail", () => {
  it("sends from enquiries@, replies to andrew@, to the quiz-taker", async () => {
    await sendQuizResultsEmail("committee@example.com", {
      score: 5,
      total: 8,
      bandTitle: "Solid foundations",
      bandBlurb: "Blurb.",
      missedAssists: [],
    });

    const call = sendEmailMock.mock.calls[0][0];
    expect(call.to).toBe("committee@example.com");
    expect(call.from).toBe(FROM_ENQUIRIES);
    expect(call.replyTo).toBe(ANDREW_EMAIL);
  });
});
