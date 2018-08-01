const path = require("path");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = (env = {}) => {
    const production = env.production || false;
    const analyze = env.analyze || false;
    const watch = env.watch || false;

    const babelLoader = {
        loader: "babel-loader",
        options: {
            compact: production,
            presets: [
                [
                    path.resolve(__dirname, "node_modules/babel-preset-env"),
                    { modules: false, targets: { ie: 10 } }
                ]
            ]
        }
    };

    const eslintLoader = {
        loader: "eslint-loader",
        options: {
            configFile: path.resolve(__dirname, ".eslintrc"),
            emitWarning: true,
            parserOptions: {ecmaVersion: 2018, sourceType: "module"}
        }
    };

    let config = {
        context: __dirname,
        entry: "./src/main.js",
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
                    use: [babelLoader, eslintLoader]
                },
                {
                    test: /\.ts$/,
                    use: [
                        babelLoader,
                        {
                            loader: "ts-loader",
                            options: {
                                appendTsSuffixTo: [/\.vue$/],
                                configFile: path.resolve(__dirname, "tsconfig.json")
                            }
                        }
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: production ? { minimize: { minifyFontValues: false, zindex: false } } : {}
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                includePaths: [
                                    path.resolve(__dirname, "node_modules/bootstrap-sass/assets/stylesheets")
                                ],
                                precision: 8
                            }
                        }
                    ]
                },
                {
                    test: /\.vue$/,
                    loader: "vue-loader",
                },
                {
                    test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                    use: [
                        { loader: "file-loader", options: { name: "[name].[ext]", outputPath: "/styles/fonts/" } }
                    ]
                }
            ]
        },
        resolve: {
            alias: {
                "vue$": path.resolve(__dirname, "node_modules/vue")
            },
            extensions: [".js", ".ts"]
        },
        output: {
            filename: `scripts/[name]${watch ? "" : ".[contenthash]"}.js`,
            path: path.resolve(__dirname, "dist")
        },
        plugins: [
            new MiniCssExtractPlugin({ filename: `styles/[name]${watch ? "" : ".[contenthash]"}.css` }),
            new VueLoaderPlugin()
        ],
        mode: production ? "production" : "development",
        optimization: { splitChunks: { chunks: "all" } },
        watch: watch,
        watchOptions: { poll: 1000, ignored: /node_modules/ }
    };
    // TODO: point production source maps to private server
    if (production) {
        config.devtool = false;
    }
    if (analyze) {
        config.plugins.push(new BundleAnalyzerPlugin());
    }

    return config;
};
