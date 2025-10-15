import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3001,
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  // server: {
  //   port: 3001,
  // },
});
