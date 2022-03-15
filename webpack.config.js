const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: "./src/index.html",
    filename: "index.html",
    inject: "body"
});

module.exports = {
    mode: "development",
    context: __dirname,
    devServer: {
        hot: true,
        compress: true,
        host: "0.0.0.0",
        port: 8080,
        historyApiFallback: true,
        open: true,
    },
    entry: {
        main: "./src/index.tsx",
    },
    output: {
        path: path.join(__dirname, "output"),
        filename: "app.bundle.js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json", ".css", ".pcss", ".png"]
    },
    module: {
        rules: [
            {
                test: /\.pcss$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    { loader: 'css-loader', options: { importLoaders: 1, modules: true } },
                    { loader: 'postcss-loader' },
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
                 exclude: /node_modules/
            },

            { test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules/ }
        ],
    },
    plugins: [
        HtmlWebpackPluginConfig,
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css',
        }),
    ]
};


