import "reflect-metadata";
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { BadRequestError } from "@/shared/app.error";

const sendMock = jest.fn<any>();
const emailRenderProviderMock = jest.fn<any>();

jest.unstable_mockModule("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

jest.unstable_mockModule("./email-render.provider", () => ({
  emailRenderProvider: emailRenderProviderMock,
}));

let EmailProvider: {
  new (): {
    send(input: {
      to: string;
      subject: string;
      template: string;
      variables: Record<string, string>;
    }): Promise<void>;
  };
};

describe("EmailProvider", () => {
  beforeAll(async () => {
    ({ EmailProvider } = await import("./email.provider"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send email via resend", async () => {
    emailRenderProviderMock.mockReturnValue("<h1>hello</h1>");
    sendMock.mockResolvedValue({ data: { id: "1" }, error: null });
    const provider = new EmailProvider();

    await provider.send({
      to: "admin@admin.com",
      subject: "Subject",
      template: "VERIFY_EMAIL",
      variables: { name: "admin" },
    });

    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it("should throw BadRequestError when resend returns error", async () => {
    emailRenderProviderMock.mockReturnValue("<h1>hello</h1>");
    sendMock.mockResolvedValue({ data: null, error: { message: "failed" } });
    const provider = new EmailProvider();

    await expect(
      provider.send({
        to: "admin@admin.com",
        subject: "Subject",
        template: "VERIFY_EMAIL",
        variables: { name: "admin" },
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
