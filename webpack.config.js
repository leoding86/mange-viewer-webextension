var path = require('path')
var webpack = require('webpack')
var fs = require('fs')

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

if (process.env.NODE_ENV === 'production') {
    console.log('Remove builds');
    var files = fs.readdirSync(path.resolve(__dirname, 'package/build'));
    files.forEach(function(file) {
        if (file === '.' || file === '...') {
            return;
        }

        fs.unlinkSync(path.resolve(__dirname, 'package/build', file));
    });

    module.exports.devtool = '#source-map'
    /** http://vue-loader.vuejs.org/en/workflow/production.html **/
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                warnings: false
            }
        }),
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
} else if (process.env.NODE_ENV === 'development') {
    module.exports.devtool = '#eval-source-map';
    new webpack.LoaderOptionsPlugin({
        options: {
            worker: {
                output: {
                    filename: "worker.js",
                    chunkFilename: "[hash].worker.js"
                }
            }
        }
    });
}