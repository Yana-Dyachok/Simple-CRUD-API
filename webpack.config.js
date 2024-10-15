import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = {
  mode: "production",
  target: "node",
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    extensionAlias: {
      '.js': ['.ts', '.js']
    },
  },
  output: {
    filename: "bundle.cjs",
    path: path.resolve(__dirname, "dist")
  }
}

export default config;