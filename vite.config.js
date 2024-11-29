import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            external: ["axios"], // Mark 'axios' as an external dependency
        },
    },
    resolve: {
        alias: {
            axios: "axios", // Explicitly alias the axios package
        },
    },
});
