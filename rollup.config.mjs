import pkg from "./package.json" with { type: "json" };

import typescript from "@rollup/plugin-typescript";

export default [
  {
    input: "src/index.ts",
    output: { name: "diff-match-patch-ts", file: `dist/${pkg.browser}`, format: "umd", sourcemap: true },
    plugins: [typescript({ tsconfig: "./tsconfig.json" })],
  },
  {
    input: "src/index.ts",
    output: [
      { file: `dist/${pkg.main}`, format: "cjs", sourcemap: true },
      { file: `dist/${pkg.module}`, format: "es", sourcemap: true },
    ],
    plugins: [typescript({ tsconfig: "./tsconfig.json" })],
  },
];
