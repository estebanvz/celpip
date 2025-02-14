// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: 'https://estebanvz.github.io',
  base: '/celpip/',
  output: "static",
  vite: {
    plugins: [tailwindcss()],
    server: {
      host: "0.0.0.0",
      hmr: { clientPort: 4321 },
      port: 4321,
      watch: { usePolling: true }
    }
  },
});
