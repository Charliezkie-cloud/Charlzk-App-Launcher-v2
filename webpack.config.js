const path = require('path');

const filename = "animation";

module.exports = {
  entry: `./webpack/${filename}.ts`,
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
    path: path.resolve(__dirname, 'dist', "assets", "js"),
  },
};