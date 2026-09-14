import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/escriba-2/",

  plugins: [
    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "Escriba",
        short_name: "Escriba",
        description:
          "Controle diário de circulação da biblioteca.",
        lang: "pt-BR",
        start_url: ".",
        display: "standalone",
        background_color: "#f5f5f5",
        theme_color: "#222222",
        icons: [
          {
            src: "/escriba-2/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/escriba-2/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

      workbox: {
        navigateFallback: "index.html",
      },
    }),
  ],
});