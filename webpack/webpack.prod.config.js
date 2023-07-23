const path = require('path');
const WebpackMerge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const baseWebpackConfig = require("./webpack.base.config");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = WebpackMerge.merge(baseWebpackConfig, {
  // 指定构建环境
  mode: "production",
  // 输出位置
  output: {
    filename: "[name].bundle.js",
    path: path.join(__dirname, './../dist'),
    chunkFilename: "[chunkhash:8].js"
  },
  // 插件
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "public/index.html",
      inject: true, // true：默认值，script标签位于html文件的 body 底部
      hash: true, // 在打包的资源插入html会加上hash
      minify: {
        removeComments: true,               //去注释
        collapseWhitespace: true,           //压缩空格
        removeAttributeQuotes: true         //去除属性引用
      }
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false, // 不将注释提取到单独文件中
      })
    ]
  }
})
