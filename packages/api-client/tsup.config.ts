import { defineConfig } from "tsup";
import { polyfillNode } from "esbuild-plugin-polyfill-node";
import pkgJson from "./package.json";

export default defineConfig({
  entry: ["./src/**/*.ts"],
  splitting: true,
  treeshake: true,
  dts: true,
  clean: true,
  outDir: "./dist",
  format: ["esm", "cjs"],
  external: [...Object.keys(pkgJson.devDependencies)],
  minify: true,
  platform: "neutral",
  esbuildPlugins: [
    polyfillNode({
      globals: {
        buffer: true,
      },
    }),
  ],
});
