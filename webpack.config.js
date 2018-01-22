var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var fse = require("fs-extra");

module.exports = {
    entry () {
        let entries = {
            popup: './src/popup.js',
            background: './src/background.js',
            content_script: './src/content_script.js',
            bootstrap: './src/bootstrap.js',
            reader: './src/reader.js'
        };

        return entries;
    },
    output: {
        path: path.resolve(__dirname, './package/build'),
        publicPath: '../build/',
        filename: 'bundle.[name].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                    }
                // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'stage-2']
                },
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(woff2?|ttf|eot|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            },
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        modules: [
            path.resolve('./node_modules'),
            path.resolve('./src')
        ]
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    performance: {
        hints: false
    },
    node: {
        fs: 'empty',
        ws: 'empty'
    },
    devtool: '#eval-source-map'
}

console.log('Remove package');
fse.readdirSync(path.resolve(__dirname, 'package'));
console.log('Package removed');

console.log('Copy package resources');
fse.copySync(path.resolve(__dirname, 'src/package'), path.resolve(__dirname, 'package'));
console.log('Package resources copied');

if (process.env.NODE_ENV === 'production') {

    module.exports.devtool = '#source-map'
    /** http://vue-loader.vuejs.org/en/workflow/production.html **/
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        })
    ])
} else if (process.env.NODE_ENV === 'development') {
    module.exports.devtool = '#eval-source-map';
}

module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.LoaderOptionsPlugin({
        options: {
            worker: {
                output: {
                    filename: "worker.js",
                    chunkFilename: "[hash].worker.js"
                }
            }
        },
        minimize: true,
    })
])

var manifestData = fs.readFileSync(path.resolve(__dirname, 'src/package/manifest.json'), 'utf-8');
var manifestDataJson = JSON.parse(manifestData);

if (process.env.NODE_ENV === 'production') {
    manifestDataJson.browser_action.default_icon = 'assets/icon128.png';
} else {
    manifestDataJson.browser_action.default_icon = 'assets/icon128-dev.png';
}

fs.writeFileSync(path.resolve(__dirname, 'package/manifest.json'), JSON.stringify(manifestDataJson));