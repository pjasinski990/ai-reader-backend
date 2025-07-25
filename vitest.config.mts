import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        environment: 'jsdom',
        globals: true,
        css: true,
        coverage: {
            reporter: ['text', 'html', 'lcov'],
        },
    },
});
