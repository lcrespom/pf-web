var path = require('path');

module.exports = {
	devtool: 'source-map',
	entry: {
		todo: ['./src/todo/main.ts'],
		crud: ['./src/crud/main.ts'],
		fractal: ['./src/fractal/main.ts'],
		router: ['./src/router/main.ts']
	},
	resolve: {
		extensions: ['.webpack.js', '.ts', '.js']
	},
	externals: {
		ramda: 'R'
	},
	module: {
		loaders: [{
			test: /\.ts$/,
			loader: 'ts-loader',
			exclude: '/node_modules'
		}]
	},
	output: {
		path: path.resolve(__dirname, 'web'),
		filename: '[name].js'
	}
};
