import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { TooManyRequestsError } from "@/shared/app.error";

const rateLimitMock = jest.fn();

jest.unstable_mockModule("express-rate-limit", () => ({
  rateLimit: rateLimitMock,
}));

let SimpleRateLimitMiddleware: {
  new (): {
    handle(options: { max: number; windowInMs: number }): unknown;
  };
};

describe("SimpleRateLimitMiddleware", () => {
  beforeAll(async () => {
    ({ SimpleRateLimitMiddleware } =
      await import("./simple-rate-limit.middleware"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should configure express-rate-limit with provided options", () => {
    const middleware = new SimpleRateLimitMiddleware();
    const returnedHandler = jest.fn();
    rateLimitMock.mockReturnValue(returnedHandler);

    const result = middleware.handle({ max: 10, windowInMs: 60000 });

    expect(result).toBe(returnedHandler);
    expect(rateLimitMock).toHaveBeenCalledWith(
      expect.objectContaining({
        windowMs: 60000,
        max: 10,
        standardHeaders: "draft-7",
        legacyHeaders: false,
      }),
    );
  });

  it("configured handler should throw TooManyRequestsError", () => {
    const middleware = new SimpleRateLimitMiddleware();
    middleware.handle({ max: 1, windowInMs: 1000 });

    const config = rateLimitMock.mock.calls[0]?.[0] as {
      handler: () => never;
    };

    expect(() => config.handler()).toThrow(TooManyRequestsError);
  });
});
