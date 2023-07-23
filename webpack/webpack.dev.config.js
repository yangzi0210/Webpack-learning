const WebpackMerge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.config");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = WebpackMerge.merge(baseWebpackConfig, {
  // 指定构建环境
  mode: "development",
  plugins: [
    // 配置输出的HTML
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "public/index.html",
      inject: true
    }),
  ],
  // 开发环境本地启动的服务配置
  devtool: 'eval-source-map',
  devServer: {
    host: 'localhost',
    port: 8089,
    // 要求每次都返回HTML，不配置会出现can not GET/
    historyApiFallback: true,
    hot: true
  }
});
