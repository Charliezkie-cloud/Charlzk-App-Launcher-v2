const path = require('path');

const filename = "renderer";

module.exports = {
  entry: `./src/${filename}.ts`,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: `${filename}.js`,
    path: path.resolve(__dirname, "dist"),
  },
};