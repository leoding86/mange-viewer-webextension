var path = require('path')
var webpack = require('webpack')
var fs = require('fs')

module.exports = {
// entry: {
//   main: './src/main.js',
//   popup: './src/popup.js',
//   background: './src/background.js',
//   app_cvr: './src/app_cvr.js'
// },
entry () {
    let entries = {
        main: './src/main.js',
        popup: './src/popup.js',
        background: './src/background.js',
        app_cvr: './src/app_cvr.js'
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
    loader: ['style-loader', 'css-loader']
}
]
},
resolve: {
    alias: {
        'vue$': 'vue/dist/vue.esm.js'
    }
},
devServer: {
    historyApiFallback: true,
    noInfo: true
},
performance: {
    hints: false
},
devtool: '#eval-source-map'
}

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
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
} else if (process.env.NODE_ENV === 'chrome') {
    console.log('Remove builds');
    var files = fs.readdirSync(path.resolve(__dirname, 'package/build'));
    files.forEach(function(file) {
        if (file === '.' || file === '...') {
            return;
        }

        fs.unlinkSync(path.resolve(__dirname, 'package/build', file));
    });
} else if (process.env.NODE_ENV === 'development') {
    module.exports.devtool = '#eval';
    module.exports.output = {
        path: path.resolve(__dirname, './package_dev/build'),
        publicPath: '../build/',
        filename: 'bundle.[name].js'
    }
}