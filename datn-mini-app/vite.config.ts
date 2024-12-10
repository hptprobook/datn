import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import zmpVitePlugin from 'zmp-vite-plugin';
import { babel } from '@rollup/plugin-babel';

// https://vitejs.dev/config/
export default defineConfig({
  root: "./src",
  base: "",
  plugins: [
    react(),
    babel({
      babelHelpers: 'bundled',
      presets: [
        ['@babel/preset-env', { targets: "defaults" }]
      ]
    }),
    zmpVitePlugin()
  ],
  build: {
    target: 'esnext', // Ensure target is set to a more recent version
    polyfillModulePreload: false,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});