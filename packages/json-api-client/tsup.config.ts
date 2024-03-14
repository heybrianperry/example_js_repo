import { defineConfig } from "tsup";
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
  target: "es2020",
});
