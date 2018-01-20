const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const webpack = require('webpack')
const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const config = require('../config/production.config')
const ExtractTextPlugin = require("extract-text-webpack-plugin")


module.exports = merge(base, {
	entry: './src/pro.js',
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: 'app.js',
		libraryTarget: 'umd'
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: 'vue-style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								minimize: true
							}
						}, 
						'sass-loader'
					]
				})
			}
		]
	},
	plugins: [
		new UglifyJSPlugin(),
		new webpack.DefinePlugin({
			'process': {
				env: config
			}
		}),
		new ExtractTextPlugin({
			filename: 'app.css'
		})
	]
})