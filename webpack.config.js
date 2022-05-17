const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const srcDirectory = path.resolve(__dirname, 'src');
const imgDirectory = path.resolve(srcDirectory, 'img');
const distDirectory = path.resolve(__dirname, 'dist');
const nodeModulesDir = path.resolve(__dirname, 'node_modules');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.[hash].js",
    path: distDirectory,
    publicPath: "/",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
      ignoreOrder: true,
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new CopyPlugin({
      patterns: [
        {from: imgDirectory, to: distDirectory},
      ],
    }),
  ],
  resolve: {
    modules: [__dirname, "node_modules"],
    extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        loader: require.resolve("babel-loader"),
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: {
              url: false,
              modules: true,
            },
          },
          // Compiles Sass to CSS
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [srcDirectory],
              },
            },
          }
        ],
      },
      {
        test: /\.css$/i,
        include: nodeModulesDir,
        use: [
          // Creates `style` nodes from JS strings
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: {
              modules: false,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        use: [{
          loader: 'file-loader',
          options: {
            limit: 10000000,
            // esModule: false,
            // outputPath: distDirectory,
            name: '[name].[ext]'
          },
        }],

      },
      {
        test: /\.(js|ts|tsx)$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ],
  },
  mode: 'development',
  devtool: "source-map",
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true,
    client: {
      progress: true,
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
};
