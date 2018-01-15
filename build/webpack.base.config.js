const path = require('path')


const config = {
	entry: './src/app.js',
	resolve: {
		alias: {
			'@': path.resolve('./src'),
			'assets': path.resolve('./src/assets')
		},
		extensions: ['.js', '.scss', '.vue']
	},

	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					extractCSS: process.env.NODE_ENV === 'production'
				}
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg$)/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: 'img/'
				}
			},
			{
		      test: /\.js$/,
		      exclude: /(node_modules|bower_components)/,
		      use: {
		        loader: 'babel-loader',
		        options: {
		        	presets: ['@babel/preset-env']
		        }
		      }
		    }
		]
	}
}

module.exports = config