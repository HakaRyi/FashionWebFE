import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { visualizer } from "rollup-plugin-visualizer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function jsAsJsxPlugin() {
  return {
    name: "js-as-jsx",
    enforce: "pre",

    async transform(code, id) {
      const normalizedId = id.replaceAll("\\", "/");

      if (!normalizedId.includes("/src/")) {
        return null;
      }

      if (!normalizedId.endsWith(".js")) {
        return null;
      }

      return transformWithEsbuild(code, id, {
        loader: "jsx",
        jsx: "automatic",
      });
    },
  };
}

function dashboardCasingBypassPlugin() {
  return {
    name: "dashboard-casing-bypass",
    enforce: "pre",

    resolveId(source) {
      const normalizedSource = source.replaceAll("\\", "/");

      if (
        normalizedSource === "@/features/dashboard/hooks/useDashboardChart" ||
        normalizedSource === "@/features/dashboard/hooks/useDashboardChart.js"
      ) {
        return path.resolve(
          __dirname,
          "./src/features/Dashboard/hooks/useDashboardChart.js"
        );
      }

      if (
        normalizedSource === "@/features/dashboard" ||
        normalizedSource === "@/features/dashboard/index" ||
        normalizedSource === "@/features/dashboard/index.js"
      ) {
        return path.resolve(__dirname, "./src/features/Dashboard/index.js");
      }

      return null;
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    dashboardCasingBypassPlugin(),
    jsAsJsxPlugin(),

    react(),

    visualizer({
      open: false,
      filename: "bundle-report.html",
      gzipSize: true,
    }),
  ],

  resolve: {
    alias: [
      {
        find: /^@\/features\/dashboard(\/.*)?$/,
        replacement: path.resolve(__dirname, "./src/features/Dashboard") + "$1",
      },
      {
        find: /^@\/feature\/Dashboard(\/.*)?$/,
        replacement: path.resolve(__dirname, "./src/features/Dashboard") + "$1",
      },
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
    ],
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