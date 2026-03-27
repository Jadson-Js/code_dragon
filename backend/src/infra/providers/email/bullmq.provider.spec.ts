import "reflect-metadata";
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

const addMock = jest.fn<(name: string, data: any, options?: any) => Promise<void>>();
const queueCtorMock = jest.fn(() => ({ add: addMock }));

const workerOnMock = jest.fn();
const workerCtorMock = jest.fn(() => ({ on: workerOnMock }));

jest.unstable_mockModule("bullmq", () => ({
  Queue: queueCtorMock,
  Worker: workerCtorMock,
  Job: jest.fn(),
}));

jest.unstable_mockModule("../../database/redis/connection", () => ({
  redisConnection: {},
}));


let EmailBullMQProvider: {
  new (emailProvider: { send(data: any): Promise<void> }): {
    start(): void;
    addJob(data: any): Promise<void>;
  };
};

describe("EmailBullMQProvider", () => {
  beforeAll(async () => {
    ({ EmailBullMQProvider } = await import("../queue/email.bullmq.provider"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should enqueue job with queue.add", async () => {
    const provider = new EmailBullMQProvider({
      send: jest.fn(async (_data: any) => undefined),
    } as any);

    await provider.addJob({ to: "admin@admin.com" });

    expect(addMock).toHaveBeenCalledWith("email", { to: "admin@admin.com" }, expect.any(Object));
  });

  it("start should create worker and subscribe events", () => {
    const provider = new EmailBullMQProvider({
      send: jest.fn(async (_data: any) => undefined),
    } as any);

    provider.start();

    expect(workerCtorMock).toHaveBeenCalledTimes(1);
  });
});

