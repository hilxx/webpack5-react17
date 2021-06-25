import type {
  WebpackOptionsNormalized,
  RuleSetRule as RuleSetRule_,
  RuleSetUseItem,
} from 'webpack'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import net from 'net'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'

export type RuleSetRule = Omit<RuleSetRule_, 'use'> & {
  use: RuleSetUseItem[]
}
export type Mode = WebpackOptionsNormalized['mode']
export type WebpackConfig = Partial<Omit<WebpackOptionsNormalized, 'module'>> & {
  module?: Partial<WebpackOptionsNormalized['module']>
}

const _getName = (isProd: boolean = false) => `[name]_${isProd ? '[contenthash]' : ''}`
const _getAsyncName = (isProd: boolean = false) => `async_${_getName(isProd)}`
const _getCssRules = (isProd: boolean): RuleSetRule => ({
  test: /\.css$/,
  use: [
    isProd ? MiniCssExtractPlugin.loader : 'style-loader',
    {
      loader: 'css-loader',
      options: {
        import: true,
        modules: {
          localIdentName: "[path][local]--[hash:base64:5]",
        },
      },
    }
  ],
})
const _getPlugins = (isProd: boolean) => {
  const basePlugins = [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ]

  if (isProd) {
    basePlugins.push(
      new MiniCssExtractPlugin({
        chunkFilename: `css/${_getAsyncName(isProd)}.css`,
        filename: `css/${_getName(isProd)}.css`
      })
    )
  }
  return basePlugins
}
const __excludeReg = /\/node_modules\//

const getDefaultConfig = (isProduction: boolean): WebpackConfig => {
  const cssRules = _getCssRules(isProduction)

  return {
    mode: isProduction ? 'production' : 'development',
    output: {
      filename: 'js/' + _getName(isProduction) + '.js',
      chunkFilename: 'js/' + _getAsyncName(isProduction) + '.js',
      path: path.resolve(__dirname, './build'),
      clean: true,
      /* 资源模块(asset module)地址 */
      assetModuleFilename: 'assets/[hash][ext][query]',
    },
    entry: './src/App.tsx' as any,
    module: {
      defaultRules: [
        cssRules,
        {
          test: /\.less$/,
          exclude: __excludeReg,
          use: [
            ...cssRules.use,
            'less-loader',
          ],
        },
      ],
      rules: [
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          exclude: __excludeReg,
          type: 'asset',
        },
        {
          test: /\.[jt]sx?$/,
          loader: 'babel-loader',
          exclude: __excludeReg,
          options: {
            presets: ['@babel/preset-react', '@babel/preset-typescript'],
            plugins: [
              [
                "module-resolver",
                {
                  alias: {
                    '@': './src',
                    '@@': './config',
                  },
                },
              ]
            ],
          },
        },
      ],
    },
    plugins: _getPlugins(isProduction),
  }
}

const getDevConfig = async (port_ = 1234): Promise<WebpackConfig> => {
  const port = await new Promise(resolve => {
    // 检测端口是否被占用
    const portIsOccupied = (testPort) => {
      // 创建服务并监听该端口
      const server = net.createServer().listen(testPort)

      server.on('listening', function () {
        server.close() // 关闭服务
        resolve(testPort)
      })
      server.on('error', function (err) {
        portIsOccupied(testPort + 1)
      })
    }
    portIsOccupied(port_)
  })

  return {
    devtool: 'cheap-module-source-map',
    devServer: {
      port,
      open: false,
      /* 打包文件获取到地址 */
      publicPath: '/',
      progress: true,
      hot: true,
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: 'http://localhost:7890',
          changeOrigin: true,
          pathRewrite: { '^/api': '/' }
        }
      }
    },
  }
}

const prodConfig: WebpackConfig = {
  optimization: {
    minimizer: [
      new CssMinimizerPlugin({
        parallel: true,
      }),
      new TerserPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        react_vendor: {
          test: /react/,
          priority: 5,
          reuseExistingChunk: true,
          name: 'react',
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          name: 'vendors',
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  }
}

export default async ({ production = false, }) => {
  return ({
    ...getDefaultConfig(production),
    ...await (production ? prodConfig : getDevConfig()),
  })
}