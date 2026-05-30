import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // @ = src/ — clean imports everywhere
      // e.g. import { THEMES } from "@/constants/themes"
      "@": "/src",
    },
  },
  build: { outDir: "dist" },
});
