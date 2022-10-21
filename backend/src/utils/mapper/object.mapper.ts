import { plainToInstance } from 'class-transformer';
export type ClassType<T> = {
  new (...args: any[]): T;
};
export const mapToClass = <T>(payload: any, toClass: ClassType<T>): T =>
  plainToInstance(toClass, payload, { excludeExtraneousValues: true });
