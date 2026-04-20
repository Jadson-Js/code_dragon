import "reflect-metadata";
import { describe, expect, it, jest, beforeEach, beforeAll } from "@jest/globals";

jest.unstable_mockModule("bullmq", () => ({
    Queue: jest.fn(() => ({})),
    Worker: jest.fn(() => ({ on: jest.fn() })),
    Job: jest.fn(),
}));

jest.unstable_mockModule("@/infra/database/redis/connection", () => ({
    redisConnection: {}
}));

let EmailBullMQProvider: any;

describe("EmailBullMQProvider", () => {
    let emailProvider: any;
    let provider: any;

    beforeAll(async () => {
        ({ EmailBullMQProvider } = await import("./email.bullmq.provider"));
    });

    beforeEach(() => {
        jest.clearAllMocks();
        emailProvider = {
            send: jest.fn(),
        };
        provider = new EmailBullMQProvider(emailProvider);
    });

    it("should call emailProvider.send during process", async () => {
        const jobData = { to: "test@example.com", subject: "Test", content: "Body" };
        const mockJob = { data: jobData } as any;

        await provider.process(mockJob);

        expect(emailProvider.send).toHaveBeenCalledWith(jobData);
    });
});
