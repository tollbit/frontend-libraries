import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const config = {
  mode: "development",
  entry: {
    bundle: "./src/index.tsx",
    cjs: "./src/cjs/index.cjs",
  },
  module: {
    rules: [
      {
        test: /.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          configFile: "tsconfig.json",
        },
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src"),
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    hot: true,
    compress: true,
    port: 9000,
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
};

export default config;
