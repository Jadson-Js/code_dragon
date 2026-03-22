import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import type { IEmailRenderProvider } from "@/domain/providers/email/email-render.provider";

const fsMock = {
  readFileSync: jest.fn<(path: string, encoding: string) => string>(),
};

jest.unstable_mockModule("fs", () => ({
  default: fsMock,
}));

let emailRenderProvider: IEmailRenderProvider;

describe("emailRenderProvider", () => {
  beforeAll(async () => {
    ({ emailRenderProvider } = await import("./email-render.provider"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load template and replace placeholders", () => {
    fsMock.readFileSync.mockReturnValue("<h1>{{name}}</h1><p>{{token}}</p>");

    const html = emailRenderProvider("VERIFY_EMAIL", {
      name: "admin",
      token: "abc",
    });

    expect(html).toBe("<h1>admin</h1><p>abc</p>");
  });
});
