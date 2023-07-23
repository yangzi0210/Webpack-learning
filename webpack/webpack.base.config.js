const path = require('path');

const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
const resolve = (link) => path.resolve(__dirname, link);
module.exports = {
  entry: path.join(__dirname, '../src/index.jsx'),
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        use: [
          {
            loader: 'babel-loader',
          }
        ],
        include: [resolve('../src')],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          // 注意loader生效是从下往上的
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: lessRegex,
        exclude: lessModuleRegex,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            // options: {
            //   lessOptions: {
            //     javascriptEnabled: true,
            //     modifyVars: theme
            //   }
            // }
          },
        ]
      },
      {
        test: lessModuleRegex,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            // options: {
            //   lessOptions: {
            //     javascriptEnabled: true,
            //     modifyVars: theme
            //   }
            // }
          },
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            //1024 == 1kb 小于10kb时打包成base64编码的图片否则单独打包成图片
            limit: 10240,
            name: path.join('img/[name].[hash:7].[ext]')
          }
        }]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240,
            name: path.join('font/[name].[hash:7].[ext]')
          }
        }]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  }
}
