var path = require('path');

module.exports = {
	devtool: 'source-map',
	entry: {
		todo: ['./src/examples/todo/main.ts'],
		crud: ['./src/examples/crud/main.ts'],
		fractal: ['./src/examples/fractal/main.ts'],
		router: ['./src/examples/router/main.ts']
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
