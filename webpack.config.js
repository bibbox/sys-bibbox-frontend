// Run this in command line from project root: "webpack"

var ExtractTextPlugin = require('extract-text-webpack-plugin');

var components = [
    {
        entry: [
            __dirname + "/components/wrapper.react.js"
        ],
        path:       __dirname + "/js",
        filename:   "apps.js"
    }
];

var stylesheets = [
    {
        entry: [
            __dirname + "/sass/apps.sass"
        ],
        path:       __dirname + "/css",
        filename:   "apps.css"
    }
];

var exports = [];

for(var i = 0; i < components.length; i++) {
    exports.push({
        entry: components[i].entry,
        output: {
            path: components[i].path,
            filename: components[i].filename
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "babel-loader",
                    query: {
                        presets: ["babel-preset-es2015", "babel-preset-react"]
                    }
                },
                {
                    test: /\.json$/,
                    loader: 'json'
                }
            ]
        }
    });
}

for(var j = 0; j < stylesheets.length; j++) {
    exports.push({
        entry: stylesheets[j].entry,
        output: {
            path: stylesheets[j].path,
            filename: stylesheets[j].filename
        },
        module: {
            loaders: [
                {
                    test: [/\.css$/, /\.sass$/, /\.scss$/],
                    loader: ExtractTextPlugin.extract(
                        'style',
                        'css!sass'
                    )
                },
                {
                    test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                    loader : 'file-loader'
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    loaders: [
                        'file?hash=sha512&digest=hex&name=[hash].[ext]',
                        'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                    ]
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin(stylesheets[j].filename)
        ]
    });
}

module.exports = exports;