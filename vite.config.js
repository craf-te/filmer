import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'index',
      fileName: 'index',
    },
    rollupOptions: {
      external: [new URL('src/index.test.ts', import.meta.url)],
      output: {
        exports: 'named',
      },
    },
  },
  test: {
    globals: true,
  },
});
