var path = require('path');
var webpack = require('webpack');

var globals = {
  'process.env.NODE_ENV' : '"production"',
  'process.env.BABEL_ENV': '"production"',
  'NODE_ENV'     : 'production',
  '__DEV__'      : false,
  '__PROD__'     : true,
  '__DEBUG__'    : false,
  '__DEBUG_NW__' : false,
  __DEVELOPMENT__: false
};

var include = [
  path.resolve(__dirname, 'app')
];

module.exports = {
  devtool: false,
  entry: [
    'babel-polyfill',
    './app/index.js'
  ],
  output: {
    path: path.join(__dirname, '../app'),
    //publicPath: '/dist/',
    filename: 'dist.js'
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}, minimize: true}),
    new webpack.DefinePlugin(globals)
  ],
  module: {
    loaders: [
      {
        test: /\.js$|\.jsx$|\.es6$|\.babel$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: [
          path.resolve(__dirname, 'app')
        ],
        query: {
          presets: ['es2015', 'react', 'stage-0'],
        }
      },
    ]
  }
};
