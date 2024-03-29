import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
    output: "hybrid",
    adapter: cloudflare({
        imageService: "compile",
        platformProxy: {
            enabled: true,
        },
    }),
    integrations: [react()],
    vite: {
        ssr: {
            external: ["@resvg/resvg-js"],
        },
        optimizeDeps: {
            exclude: ["@resvg/resvg-js", "src/utils/generateOgImage.ts"],
        },
    }
});
