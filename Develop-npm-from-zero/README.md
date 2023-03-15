## 前言

🚩🚩🚩

一开始使用React写项目都是直接npx create-react-app name

但是要更好的理解npm包构建原理，能看懂别人的开源代码就要自己从头构建一个

本文使用webpack, less, typescript, react 构建项目

该项目为用hooks函数组件修改后的官方React教程中的井字棋

## 开始

需要下载 [node.js](https://link.juejin.cn?target=https%3A%2F%2Fnodejs.org%2Fzh-cn%2F) 软件
创建项目目录并初始化

```bash
$ mkdir Develop-npm-from-zero
$ cd Develop-npm-from-zero
$ npm init
```

cmd执行命令后一直回车键或者输入你指定的值也可以 不影响

## webpack环境安装配置

### 一、安装webpack

```
$ npm i --save-dev webpack webpack-cli html-webpack-plugin terser-webpack-plugin webpack-dev-server webpack-merge
```

### 二、创建 webpack 存放各种配置文件的目录

在项目根目录新建 webpack 文件夹  用来存放其配置文件

新建 `webpack.base.config.js`、`webpack.dev.config.js`、`webpack.prod.config.js` 文件

### 三、配置 `webpack.base.config.js`

暂时先配置 `webpack.base.config.js` 文件  使其可以运行

```
const path = require('path');
module.exports = {
  entry: path.join(__dirname, '../src/index.js'), // 入口文件，/src/index.js
}
```

### 四、配置 `webpack.dev.config.js`

```
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
    port: 3000,
    // 要求每次都返回HTML，不配置会出现can not GET/
    historyApiFallback: true,
    hot: true
  }
});
```

### 五、创建src文件夹

在项目根目录创建src文件夹，作为存放业务代码的地方

然后创建 `index.js` 文件，作为打包的入口文件

### 六、创建启动命令

在 `package.json` 的 `scripts` 中，创建命令：

- `start` 为本地开发启动的命令
- `build` 是打包项目的命令

```
{
    // ...
    "scripts": {
      "start": "webpack-dev-server --config webpack/webpack.dev.config.js --open",
      "build": "webpack --config webpack/webpack.prod.config.js",
      "test": "echo "Error: no test specified" && exit 1"
    }
    // ...
}
```

### 七、启动本地开发环境

```
$ npm start
```

## 安装配置 React环境

### 安装 React

```
$ npm install --save react react-dom
```

### 安装 babel 

```
$ npm install --save-dev @babel/core babel-loader @babel/preset-env @babel/preset-react @babel/plugin-transform-runtime @babel/runtime-corejs3
```

- 在项目根目录创建 babel.config.js 文件，用来配置 babel

```
module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react'
  ],
  plugins: [ // 插件
    [
      '@babel/plugin-transform-runtime',
      {
        'corejs': 3
      }
    ],
  ]
}
```

- 修改 webpack 配置  使其使用 babel-loader 处理 JSX 语法
- 修改 webpack.base.config.js 

```
const path = require('path');

const resolve = (link) => path.resolve(__dirname, link);
module.exports = {
  entry: path.join(__dirname, '../src/index.jsx'),
  module: { // 模块
    rules: [
      {
        test: /.jsx$/,
        use: [
          {
            loader: 'babel-loader', // 使用 babel-loader
          }
        ],
        include: [resolve('../src')],
        exclude: /node_modules/
      }
    ]
  }
}
```

- 修改 index.js 为 index.jsx，以JSX格式重写里面代

运行：

```
$ npm start
```

成功运行！

## 安装配置loader环境

### 安装各种 loader环境

```
$ npm install --save-dev css-loader style-loader url-loader post-loader less less-loader autoprefixer
```

- 重新配置 webpack.base.config.js文件

```
const path = require('path');

const lessRegex = /.less$/;
const lessModuleRegex = /.module.less$/;
const resolve = (link) => path.resolve(__dirname, link);
module.exports = {
  entry: path.join(__dirname, '../src/index.jsx'),
  module: {
    rules: [
      {
        test: /.jsx$/,
        use: [
          {
            loader: 'babel-loader',
          }
        ],
        include: [resolve('../src')],
        exclude: /node_modules/
      },
      {
        test: /.css$/,
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
          },
        ]
      },
      {
        test: /.(png|jpe?g|gif|svg)(?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            //1024 == 1kb
            //小于10kb时打包成base64编码的图片否则单独打包成图片
            limit: 10240,
            name: path.join('img/[name].[hash:7].[ext]')
          }
        }]
      },
      {
        test: /.(woff2?|eot|ttf|otf)(?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240,
            name: path.join('font/[name].[hash:7].[ext]')
          }
        }]
      }
    ]
  }
}
```

（可选）

这里安装了 postcss-loader 作用是自动补全 css 前缀

需要配置 postcss-loader 使其生效

```
npm i -D postcss-loader
npm i -D autoprefixer
```

方法类似babel 在项目目录新建 postcss.config.js  写入代码

```
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
};
```

在 src 下新建 global.less并写入样式，然后在 index.jsx 中引入进行测试

```
import './global.less';
```

## 测试目前代码

```
$ npm start
```

项目运行成功且可以正常加载 .less 文件！

## 安装配置 typescript环境

### 安装 typescript

```
$ npm install --save typescript
$ npm install --save-dev @babel/preset-typescript @types/react
```

### 配置 typescript环境

- 修改 babel.config.js

```
module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        'corejs': 3
      }
    ],
  ]
}
```

- 修改 webpack.base.config.js

```
// ...
module.exports = {
    // ...
    module: {
        rules: [
            {
              test: /.(j|t)sx?$/,  //-------修改一
              use: [
                {
                  loader: 'babel-loader',
                }
              ],
              include: [resolve('../src')],
              exclude: /node_modules/
            }
            // ...
        ]
    },
    resolve: { //----------------------------修改二
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    }
}
```

- 添加 typescript 配置文件
- 新建 tsconfig.json 配置文件

```
{
  "compilerOptions": {
    /* Basic Options */
    "target": "es5",                          /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019' or 'ESNEXT'. */
    "module": "esnext",                       /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],                                        /* Specify library files to be included in the compilation. */
    "allowJs": true,                          /* Allow javascript files to be compiled. */
    "jsx": "react",                           /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
    "sourceMap": true,                        /* Generates corresponding '.map' file. */
    "outDir": "./dist",                       /* Redirect output structure to the directory. */
    "isolatedModules": false,                  /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "strict": true,                           /* Enable all strict type-checking options. */
    "noImplicitThis": true,                   /* Raise error on 'this' expressions with an implied 'any' type. */
    "noImplicitReturns": true,                /* Report error when not all code paths in function return a value. */
    "moduleResolution": "node",               /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    "baseUrl": ".",                       /* Base directory to resolve non-absolute module names. */
    "allowSyntheticDefaultImports": true,     /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true,                  /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    "experimentalDecorators": true,           /* Enables experimental support for ES7 decorators. */
    "paths": {

    }
  },
  "include": [
    "src"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

关于 `tsconfig.json` 更多的配置说明

查看：https://www.tslang.cn/docs/handbook/tsconfig-json.html

到此 typescript的环境配置完成，可自行修改 src 下的文件为 tsx并重写来进行测试。

## 配置生产环境

修改 webpack/webpack.prod.config.js文件

```
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
```

运行

```
$ npm run build
```

发现运行完毕会在根目录下产生 dist 文件夹格式如下

即为打包后的文件  

现在可以直接运行 index.html



```
|-- dist
    |-- index.html
    |-- main.bundle.js
```

到此，已经完成了react + webpack +less+typescript 构建自己的项目的整个过程！

![](https://s1.ax1x.com/2023/03/14/ppl7LSH.png)

## 最终目录结构

```
|-- Develop-npm-from-zero
    |-- babel.config.js
    |-- package-lock.json
    |-- package.json
    |-- postcss.config.js
    |-- tsconfig.json
    |-- node_modules
    |-- dist
    |   |-- index.html
    |   |-- main.bundle.js
    |-- public
    |   |-- index.html
    |-- src
    |   |-- global.less
    |   |-- index.jsx
    |   |-- pages
    |       |-- Home
    |           |-- index.tsx
    |-- webpack
        |-- webpack.base.config.js
        |-- webpack.dev.config.js
        |-- webpack.prod.config.js
```

## 报错解决方法

### Module not found: Error: Can t resolve  postcss-loader xxx

```
npm -i install postcss-loader
```

###  Error: Cannot find module 'clean-webpack-plugin'

```
npm -i install clean-webpack-plugin
```

### Module not found: Error: Can't resolve 'react-dom/client' in 

原先的代码

```
......
import ReactDOM from 'react-dom/client';
......

......
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
......
```

修改为

```
......
import ReactDom from 'react-dom';
......

......
ReactDom.render(<Game />,document.getElementById("root"));
......
```

## 参考

https://juejin.cn/post/7065518734433058847

