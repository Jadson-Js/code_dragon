export interface IBaseQueueProvider<T> {
  addJob(data: T): Promise<void>;
  start(): void;
}
