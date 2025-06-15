export function cosineSimilarity(a: number[], b: number[]): number {
    const dot = a.reduce((acc, v, i) => acc + v * (b[i] ?? 0), 0);
    const magA = Math.sqrt(a.reduce((acc, v) => acc + v * v, 0));
    const magB = Math.sqrt(b.reduce((acc, v) => acc + v * v, 0));
    return magA && magB ? dot / (magA * magB) : 0;
}
