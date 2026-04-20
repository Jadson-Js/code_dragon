import "reflect-metadata";
import { describe, expect, it, jest, beforeEach, beforeAll } from "@jest/globals";

const mockQueue = {
    add: jest.fn<any>(),
};
const mockWorkerInstance = {
    on: jest.fn<any>(),
};
const mockWorker = jest.fn<any>(() => mockWorkerInstance);

jest.unstable_mockModule("bullmq", () => ({
    Queue: jest.fn(() => mockQueue),
    Worker: mockWorker,
    Job: jest.fn(),
}));

let BaseBullMQProvider: any;
let Queue: any;
let Worker: any;

class TestBullMQProvider extends (await import("./base.bullmq.provider")).BaseBullMQProvider<any> {
    async process(job: any): Promise<void> {
        // test implementation
    }
}

describe("BaseBullMQProvider", () => {
    const queueName = "test-queue";
    const connection = { host: "localhost", port: 6379 } as any;

    beforeAll(async () => {
        const bullmq = await import("bullmq");
        Queue = bullmq.Queue;
        Worker = bullmq.Worker;
        // Skip Job as it's primarily used as a type or placeholder in the provider
        ({ BaseBullMQProvider } = await import("./base.bullmq.provider"));
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize queue on construction", () => {
        new TestBullMQProvider(queueName, connection);
        expect(Queue).toHaveBeenCalledWith(queueName, { connection });
    });

    it("should start a worker when start is called", () => {
        const provider = new TestBullMQProvider(queueName, connection);
        provider.start();
        expect(Worker).toHaveBeenCalledWith(queueName, expect.any(Function), expect.objectContaining({
            connection,
            concurrency: 1,
        }));
    });

    it("should add a job to the queue", async () => {
        const provider = new TestBullMQProvider(queueName, connection);
        const data = { foo: "bar" };

        await provider.addJob(data);

        expect(mockQueue.add).toHaveBeenCalledWith(queueName, data, expect.objectContaining({
            attempts: 3,
        }));
    });
});
