import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import node from "@astrojs/node";

const cloudflareAdapter = cloudflare({
    imageService: "passthrough",
    platformProxy: {
        enabled: true,
    },
});

const nodeAdapter = node({
    mode: "standalone",
});

// https://astro.build/config
export default defineConfig({
    output: "server",
    adapter: cloudflareAdapter,
});
