import react from "@astrojs/react"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"

export default defineConfig({
  outDir: "../../dist/packages/landing",
  integrations: [react(), tailwind()]
})
