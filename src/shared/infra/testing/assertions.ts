import { Result, ResultError, ResultOk } from '@/shared/entities/result';
import { expect } from 'vitest';

export function expectResultOk<T>(result: Result<T, unknown>) : asserts result is ResultOk<T> {
    expect(result.ok).toBe(true);
}

export function expectResultError<E>(result: Result<unknown, E>) : asserts result is ResultError<E> {
    expect(result.ok).toBe(false);
}
