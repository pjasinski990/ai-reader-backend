import { decode, encode } from 'gpt-tokenizer';
import { v4 as uuidv4 } from 'uuid';
import { TextChunk } from '@/contexts/material/entities/chunk';

export class RecursiveTextChunker {
    constructor(
        private readonly overlap = 32,
        private readonly fanOut = 4,
    ) {}

    chunk(text: string, chunkSize: number): TextChunk[] {
        const root: TextChunk = {
            id: uuidv4(),
            parentId: null,
            childrenIds: [],
            text,
            metadata: { level: 0, startOffset: 0, endOffset: text.length },
        };
        return this.split(root, chunkSize);
    }

    private split(node: TextChunk, chunkSize: number): TextChunk[] {
        const tokens = encode(node.text);
        if (tokens.length <= chunkSize) return [node];

        const slices = this.slicePoints(tokens);
        let prevCut = 0;
        const children: TextChunk[] = [];

        slices.forEach((endTokIdx, idx) => {
            const startTokIdx = idx === 0 ? 0 : Math.max(prevCut - this.overlap, 0);
            const child = this.buildChild(node, tokens, startTokIdx, endTokIdx, idx);
            children.push(child);
            prevCut = endTokIdx;
        });

        node = {...node, childrenIds: children.map(c => c.id)};
        return [node, ...children.flatMap(c => this.split(c, chunkSize))];
    }

    private slicePoints(tokens: number[]): number[] {
        const target = Math.ceil(tokens.length / this.fanOut);
        const pts: number[] = [];
        for (let i = 1; i < this.fanOut; i++) {
            const approx = i * target;
            pts.push(this.backtrack(tokens, Math.min(approx, tokens.length - 1), target - 20));
        }
        pts.push(tokens.length);
        return pts;
    }

    private backtrack(tokens: number[], from: number, min: number): number {
        for (let i = from; i >= min; i--) {
            if (this.isBoundaryToken(tokens[i])) return i + 1;
        }
        return from;
    }

    private isBoundaryToken(token: number): boolean {
        if (token === undefined) return false;
        const decoded = decode([token]);
        return /[.,;!?\n]/.test(decoded);
    }

    private buildChild(
        node: TextChunk,
        tokens: number[],
        startTokIdx: number,
        endTokIdx: number,
        idx: number,
    ): TextChunk {
        const charStart = this.charPos(tokens, startTokIdx);
        const charEnd = this.charPos(tokens, endTokIdx);

        return {
            id: `${node.id}.${idx}`,
            parentId: node.id,
            childrenIds: [],
            text: node.text.substring(charStart, charEnd),
            metadata: {
                level: node.metadata.level + 1,
                startOffset: node.metadata.startOffset + charStart,
                endOffset: node.metadata.startOffset + charEnd,
            },
        };
    }

    private charPos(tokens: number[], idx: number): number {
        if (idx <= 0) return 0;
        return decode(tokens.slice(0, idx)).length;
    }
}
