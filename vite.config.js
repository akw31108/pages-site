import { defineConfig } from "vite";
import { resolve } from "path";
import react from '@vitejs/plugin-react'


export default defineConfig({
    plugins: [react()],

    base: "/pages-site/",
    build: {
        outDir: "docs",
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                about: resolve(__dirname, "about/index.html"),
                california: resolve(__dirname, "california/index.html"),
                family: resolve(__dirname, "./family/index.html"),
            },
        },
    },
});