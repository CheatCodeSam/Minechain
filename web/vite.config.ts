import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    hmr: {
      clientPort: 80
    }
  },
  plugins: [react()]
})
