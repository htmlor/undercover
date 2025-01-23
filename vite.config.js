import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import legacy from "@vitejs/plugin-legacy";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { TDesignResolver } from "unplugin-vue-components/resolvers";
import { visualizer } from "rollup-plugin-visualizer";
import * as child from "child_process";

const plugins = [];

if (process.env.NODE_ENV === "production") {
}

const commitHash = "local";

const buildDate = new Date().getTime();

// https://vitejs.dev/config/
export default defineConfig({
  base:
    process.env.NODE_ENV === "production"
      ? ""
      : "./",
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [
        TDesignResolver({
          library: "vue-next",
        }),
      ],
    }),
    Components({
      resolvers: [
        TDesignResolver({
          library: "vue-next",
        }),
      ],
    }),
    // VitePWA({
    //   injectRegister: "auto",
    // }),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
    ...plugins,
  ],
});
