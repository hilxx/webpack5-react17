import type {
  WebpackOptionsNormalized,
  RuleSetRule as RuleSetRule_,
  RuleSetUseItem,
} from 'webpack'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import portfinder from 'portfinder'
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
const _getBableOptions = (isProd) => {
  const presets = ['@babel/preset-react', '@babel/preset-typescript']
  const plugins: any[] = [
    [
      "module-resolver",
      {
        alias: {
          '@': './src',
          '@@': './config',
          '@style': './src/assets/styles',
          '@imgs': './src/assets/imgs',
        },
      },
    ],
  ]

  if (!isProd) {
    plugins.push('react-hot-loader/babel')
  }
  return {
    presets,
    plugins,
  }
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
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx',],
    },
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
          options: _getBableOptions(isProduction),
        },
      ],
    },
    plugins: _getPlugins(isProduction),
  }
}

const getDevConfig = async (port_ = 1234): Promise<WebpackConfig> => {
  const port = await portfinder.getPortPromise({ port: port_ })

  return {
    entry: ['react-hot-loader/patch', './src/App.tsx'] as any,
    devtool: 'cheap-module-source-map',
    stats: 'errors-only',
    devServer: {
      port,
      open: false,
      /* 打包文件获取到地址 */
      publicPath: '/',
      progress: true,
      hot: true,
      historyApiFallback: true,
      clientLogLevel: 'silent',
      proxy: {
        '/api': {
          target: 'http://localhost:7890',
          changeOrigin: true,
          pathRewrite: { '^/api': '/' }
        }
      },
    },
  }
}

const prodConfig: WebpackConfig = {
  entry: ['./src/App.tsx'] as any,
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

export default async () => {
  const isProd = process.env.NODE_ENV === 'production'
  return ({
    ...getDefaultConfig(isProd),
    ... (isProd ? prodConfig : await getDevConfig()),
  })
}