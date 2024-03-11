import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    origin: '',
    // origin: 'https://dev.pacgc.pw',
    port: 4173,
    strictPort: true,
    hmr: {
      host: "localhost",
      port: 5173,
      protocol: "ws",
    },
  },
  build: {
    outDir: "build",
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
})
