import "reflect-metadata";
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

const addMock = jest.fn<(name: string, data: unknown) => Promise<void>>();
const queueCtorMock = jest.fn(() => ({ add: addMock }));

const workerOnMock = jest.fn();
const workerCtorMock = jest.fn(() => ({ on: workerOnMock }));

jest.unstable_mockModule("bullmq", () => ({
  Queue: queueCtorMock,
  Worker: workerCtorMock,
}));

jest.unstable_mockModule("../../database/redis/connection", () => ({
  redisConnection: {},
}));

let EmailQueueProvider: {
  new (emailProvider: { send(data: unknown): Promise<void> }): {
    start(): void;
    addJob(data: unknown): Promise<void>;
  };
};

describe("EmailQueueProvider", () => {
  beforeAll(async () => {
    ({ EmailQueueProvider } = await import("./bullmq.provider"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should enqueue job with queue.add", async () => {
    const provider = new EmailQueueProvider({
      send: jest.fn(async (_data: unknown) => undefined),
    });

    await provider.addJob({ to: "admin@admin.com" });

    expect(addMock).toHaveBeenCalledWith("email", { to: "admin@admin.com" });
  });

  it("start should create worker and subscribe events", () => {
    const provider = new EmailQueueProvider({
      send: jest.fn(async (_data: unknown) => undefined),
    });

    provider.start();

    expect(workerCtorMock).toHaveBeenCalledTimes(1);
    expect(workerOnMock).toHaveBeenCalledWith(
      "completed",
      expect.any(Function),
    );
    expect(workerOnMock).toHaveBeenCalledWith("failed", expect.any(Function));
    expect(workerOnMock).toHaveBeenCalledWith("stalled", expect.any(Function));
  });
});
