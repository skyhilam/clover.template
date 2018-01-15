const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = require('../config/development.config')


module.exports = merge(base, {
	output: {
		path: path.resolve(__dirname, '../dev'),
		filename: 'app.js'
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
			filename: 'index.html',
			template: 'src/index.html'
		}),
		new webpack.DefinePlugin({
			'process': {
				env: config
			}
		})
	],
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					'css-loader',
					'sass-loader'
				]
			}
		]
	},
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dev',
		compress: true,
		overlay: true
	}
})