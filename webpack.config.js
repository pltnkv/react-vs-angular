var path = require('path')
var webpack = require('webpack')

module.exports = {
	entry: "./src/entry",
	output: {
		path: path.resolve("./out"),
		filename: "bundle.js"
	},
	resolve: {
		root: [path.resolve('./src')],
		extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx"]
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel',
				query: {
					presets: ["react"],
					plugins: [
						["transform-decorators-legacy"]
					]
				}
			},
			{
				test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
				loader: 'file?name=[path][name].[extlf]'
			},
			{
				test: /\.html$/,
				loader: "html"
			}
		]
	},
	devtool: 'cheap-source-map',
	devServer: {
		port: '8083',
		contentBase: path.resolve('./out'),
		hot: true
	}
};