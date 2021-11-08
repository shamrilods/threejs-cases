const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const BUILD_FOLDER = "build";

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    scripts: ["./src/js/index.js", "./src/scss/main.scss", "./src/index.html"],
  },
  output: {
    path: path.resolve(__dirname, BUILD_FOLDER),
    publicPath: "",
    filename: "[name].bundle.js",
    clean: true,
  },
  devServer: {
    host: "0.0.0.0",
    port: 7777,
    static: path.resolve(__dirname, BUILD_FOLDER),
    historyApiFallback: true,
    open: true,
  },
  resolve: {
    extensions: [".js", ".sass", ".scss", ".css"],
    modules: ["./node_modules/"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              url: false,
            },
          },
        ],
      },
      {
        test: /\.s[a|c]ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              url: false,
            },
          },
          {
            loader: "sass-loader",
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(json)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "src/index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "css/style.min.css",
      chunkFilename: "[id].css",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/3d"),
          to: path.resolve(__dirname, BUILD_FOLDER, "3d"),
        },
      ],
    }),
  ],
};
