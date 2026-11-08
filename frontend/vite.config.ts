/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// APP_VERSION selects the deployment slot: v1 → /ReqsforInfoSys/v1/ built into ../v1
const version = process.env.APP_VERSION ?? 'v1';

export default defineConfig({
  plugins: [react()],
  base: `/ReqsforInfoSys/${version}/`,
  define: { __APP_VERSION__: JSON.stringify(version) },
  build: { outDir: `../${version}`, emptyOutDir: true },
  test: { environment: 'node' },
});
