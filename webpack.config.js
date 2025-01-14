"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var path_1 = __importDefault(require("path"));
var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
var portfinder_1 = __importDefault(require("portfinder"));
var mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
var css_minimizer_webpack_plugin_1 = __importDefault(require("css-minimizer-webpack-plugin"));
var terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
var _getName = function (isProd) {
    if (isProd === void 0) { isProd = false; }
    return "[name]_" + (isProd ? '[contenthash]' : '');
};
var _getAsyncName = function (isProd) {
    if (isProd === void 0) { isProd = false; }
    return "async_" + _getName(isProd);
};
var _getCssRules = function (isProd) { return ({
    test: /\.css$/,
    use: [
        isProd ? mini_css_extract_plugin_1["default"].loader : 'style-loader',
        {
            loader: 'css-loader',
            options: {
                "import": true,
                modules: {
                    localIdentName: "[path][local]--[hash:base64:5]"
                }
            }
        }
    ]
}); };
var _getPlugins = function (isProd) {
    var basePlugins = [
        new html_webpack_plugin_1["default"]({
            template: './public/index.html'
        }),
    ];
    if (isProd) {
        basePlugins.push(new mini_css_extract_plugin_1["default"]({
            chunkFilename: "css/" + _getAsyncName(isProd) + ".css",
            filename: "css/" + _getName(isProd) + ".css"
        }));
    }
    return basePlugins;
};
var _getBableOptions = function (isProd) {
    var presets = ['@babel/preset-react', '@babel/preset-typescript'];
    var plugins = [
        [
            "module-resolver",
            {
                alias: {
                    '@': './src',
                    '@@': './config',
                    '@style': './src/assets/styles',
                    '@imgs': './src/assets/imgs'
                }
            },
        ],
    ];
    if (!isProd) {
        plugins.push('react-hot-loader/babel');
    }
    return {
        presets: presets,
        plugins: plugins
    };
};
var __excludeReg = /\/node_modules\//;
var getDefaultConfig = function (isProduction) {
    var cssRules = _getCssRules(isProduction);
    return {
        mode: isProduction ? 'production' : 'development',
        output: {
            filename: 'js/' + _getName(isProduction) + '.js',
            chunkFilename: 'js/' + _getAsyncName(isProduction) + '.js',
            path: path_1["default"].resolve(__dirname, './build'),
            clean: true,
            /* 资源模块(asset module)地址 */
            assetModuleFilename: 'assets/[hash][ext][query]'
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx',]
        },
        module: {
            defaultRules: [
                cssRules,
                {
                    test: /\.less$/,
                    exclude: __excludeReg,
                    use: __spreadArray(__spreadArray([], cssRules.use), [
                        'less-loader',
                    ])
                },
            ],
            rules: [
                {
                    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                    exclude: __excludeReg,
                    type: 'asset'
                },
                {
                    test: /\.[jt]sx?$/,
                    loader: 'babel-loader',
                    exclude: __excludeReg,
                    options: _getBableOptions(isProduction)
                },
            ]
        },
        plugins: _getPlugins(isProduction)
    };
};
var getDevConfig = function (port_) {
    if (port_ === void 0) { port_ = 1234; }
    return __awaiter(void 0, void 0, void 0, function () {
        var port;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, portfinder_1["default"].getPortPromise({ port: port_ })];
                case 1:
                    port = _a.sent();
                    return [2 /*return*/, {
                            entry: ['react-hot-loader/patch', './src/App.tsx'],
                            devtool: 'cheap-module-source-map',
                            stats: 'errors-only',
                            devServer: {
                                port: port,
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
                                }
                            }
                        }];
            }
        });
    });
};
var prodConfig = {
    entry: ['./src/App.tsx'],
    optimization: {
        minimizer: [
            new css_minimizer_webpack_plugin_1["default"]({
                parallel: true
            }),
            new terser_webpack_plugin_1["default"](),
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
                    name: 'react'
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                    name: 'vendors'
                },
                "default": {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }
};
exports["default"] = (function () { return __awaiter(void 0, void 0, void 0, function () {
    var isProd, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                isProd = process.env.NODE_ENV === 'production';
                _a = [__assign({}, getDefaultConfig(isProd))];
                if (!isProd) return [3 /*break*/, 1];
                _b = prodConfig;
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, getDevConfig()];
            case 2:
                _b = _c.sent();
                _c.label = 3;
            case 3: return [2 /*return*/, (__assign.apply(void 0, _a.concat([(_b)])))];
        }
    });
}); });
