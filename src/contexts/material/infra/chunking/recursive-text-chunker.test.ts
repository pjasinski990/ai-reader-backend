import { beforeEach, describe, expect, it } from 'vitest';
import { encode } from 'gpt-tokenizer';
import { RecursiveTextChunker } from '@/contexts/material/infra/chunking/recursive-text-chunker';

describe('TextChunker', () => {
    const CHUNK_SIZE = 50;
    const OVERLAP    = 5;
    let chunker: RecursiveTextChunker;

    beforeEach(() => {
        chunker = new RecursiveTextChunker(OVERLAP, 4);
    });

    it('returns one chunk when the input is ≤ CHUNK_SIZE tokens', () => {
        const text = 'Short text.';
        expect(encode(text).length).toBeLessThanOrEqual(CHUNK_SIZE);

        const chunks = chunker.chunk(text, CHUNK_SIZE);

        expect(chunks).toHaveLength(1);
        expect(chunks[0].text).toBe(text);
        expect(chunks[0].metadata.startOffset).toBe(0);
        expect(chunks[0].metadata.endOffset).toBe(text.length);
    });

    it('splits long text into ≤ CHUNK_SIZE-token chunks and keeps the declared overlap', () => {
        const text = Array.from({ length: 300 }, (_, i) => `word${i}.`).join(' ');
        const chunks = chunker.chunk(text, CHUNK_SIZE);

        const maxDepth = Math.max(...chunks.map(c => c.metadata.level));
        const leafChunks = chunks.filter(c => c.metadata.level === maxDepth);

        leafChunks.forEach((chunk, idx) => {
            const tokLen = encode(chunk.text).length;
            expect(tokLen).toBeLessThanOrEqual(CHUNK_SIZE);

            const slice = text.slice(chunk.metadata.startOffset, chunk.metadata.endOffset);
            expect(slice).toBe(chunk.text);

            if (idx > 0) {
                const prevToks = encode(leafChunks[idx - 1].text);
                const currToks = encode(chunk.text);
                const expected = Math.min(OVERLAP, prevToks.length, currToks.length);
                expect(currToks.slice(0, expected)).toEqual(prevToks.slice(-expected));
            }
        });
    });

    it('assigns consistent hierarchical ids and parentIds', () => {
        const text = Array.from({ length: 120 }, (_, i) => `Sentence ${i}.`).join(' ');
        const chunks = chunker.chunk(text, CHUNK_SIZE);

        const root = chunks.find(c => c.parentId === null);
        expect(root).toBeDefined();

        chunks.forEach(chunk => {
            if (chunk.parentId === null) {
                expect(chunk).toBe(root);
            } else {
                expect(chunk.id.startsWith(`${chunk.parentId}.`)).toBe(true);
            }
        });
    });

    it('produces contiguous metadata ranges (allowing for token overlap)', () => {
        const text = Array.from({ length: 200 }, (_, i) => `word${i}.`).join(' ');
        const chunks = chunker.chunk(text, CHUNK_SIZE);
        const ordered = chunks
            .slice()
            .sort((a, b) => a.metadata.startOffset - b.metadata.startOffset);

        ordered.forEach((chunk, idx) => {
            expect(chunk.metadata.startOffset).toBeLessThan(chunk.metadata.endOffset);

            if (idx > 0) {
                const prev = ordered[idx - 1];
                expect(chunk.metadata.startOffset).toBeLessThanOrEqual(prev.metadata.endOffset);
            }
        });

        expect(ordered.at(-1)!.metadata.endOffset).toBe(text.length);
    });

    it('produces the expected number of chunks at each level', () => {
        const localChunker = new RecursiveTextChunker(0, 2);
        const text = Array.from({ length: 8 }, () => 'w').join(' ');
        expect(encode(text).length).toBe(8);

        const chunks = localChunker.chunk(text, 2);
        const counts: Record<number, number> = {};
        chunks.forEach((c) => {
            const lvl = c.metadata.level;
            counts[lvl] = (counts[lvl] ?? 0) + 1;
        });

        expect(counts[0]).toBe(1);
        expect(counts[1]).toBe(2);
        expect(counts[2]).toBe(4);
    });

    it('stores children ids consistently', () => {
        const localChunker = new RecursiveTextChunker(0, 2); // overlap 0, fanout 2
        const text = Array.from({ length: 8 }, () => 'w').join(' ');
        const chunks = localChunker.chunk(text, 2);

        const byId = Object.fromEntries(chunks.map(c => [c.id, c]));

        chunks.forEach(chunk => {
            chunk.childrenIds.forEach((childId: string) => {
                expect(byId[childId]).toBeDefined();
                expect(byId[childId].parentId).toBe(chunk.id);
            });
        });

        chunks
            .filter(chunk => chunk.childrenIds.length > 0)
            .forEach(chunk => {
                chunk.childrenIds.forEach((childId: string) => {
                    expect(byId[childId].parentId).toBe(chunk.id);
                });
            });

        chunks
            .filter(chunk => chunk.childrenIds.length === 0)
            .forEach(chunk => {
                expect(chunk.childrenIds).toHaveLength(0);
            });
    });
});
