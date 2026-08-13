import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Libera a escuta para conexões externas
    allowedHosts: true, // Libera qualquer domínio de túnel (pinggy, localtunnel, etc.)
  },
});
