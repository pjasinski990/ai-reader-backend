import { vi } from 'vitest';

export function skipTime(amountMs: number) {
    const now = Date.now();
    const later = now + amountMs;
    vi.spyOn(Date, 'now').mockReturnValue(later);
}
