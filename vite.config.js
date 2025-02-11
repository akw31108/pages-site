import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        outDir: "docs",
        rollupOptions: {
            input: {
                main: resolve(__dirname, "./index.html"),
                about: resolve(__dirname, "./about/index.html"),
                california: resolve(__dirname, "./california/index.html"),
                family: resolve(__dirname, "./family/index.html"),
            },
        },
    },
});