export class Random {
    static pick<T>(items: T[]): T {
        return items[Math.floor(Math.random() * items.length)];
    }

    static int(low: number = 3, high: number = 10): number {
        return Math.floor(Math.random() * (high - low)) + low;
    }
}
