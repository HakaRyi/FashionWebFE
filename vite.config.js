import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { visualizer } from "rollup-plugin-visualizer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false,
      filename: "bundle-report.html",
      gzipSize: true,
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  /**
   * Allow JSX syntax inside .js files under src.
   * This is a bypass for files like:
   * src/features/Dashboard/index.js
   */
    esbuild: {
    loader: "jsx",
    include: /src[/\\].*\.js$/,
    exclude: [],
    },

  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5196",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@microsoft/signalr")) {
              return "signalr";
            }

            if (id.includes("recharts") || id.includes("d3")) {
              return "charts";
            }

            if (id.includes("framer-motion") || id.includes("motion")) {
              return "animations";
            }

            if (id.includes("swiper")) {
              return "swiper";
            }

            if (id.includes("xlsx")) {
              return "excel-utils";
            }

            return "vendor";
          }
        },
      },
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    css: true,
  },
});