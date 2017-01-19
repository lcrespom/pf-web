var path = require('path');
var webpack = require('webpack');

const PROD = 1, DEV = 2;

function getTarget(env) {
	if (!env.target) {
		console.error('ERROR: no "target" environment found!');
		console.error('       use --env.target=PROD|DEV in webpack command line');
		process.exit(2);
	}
	console.log('Building for target: ' + env.target);
	switch (env.target) {
		case 'PROD': return PROD;
		case 'DEV': return DEV;
		default:
			console.error(`ERROR: invalid target "${env.target}"`);
			process.exit(1);
	}
}

module.exports = function(env) {
	let target = getTarget(env);
	let plugins = [];
	if (target == PROD) {
		plugins = [
			new webpack.optimize.UglifyJsPlugin()
		];
	}
	return {
		devtool: 'source-map',
		entry: {
			todo: ['./src/todo/main.ts'],
			crud: ['./src/crud/main.ts'],
			fractal: ['./src/fractal/main.ts']
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
		plugins,
		output: {
			path: path.resolve(__dirname, 'web'),
			filename: '[name].js'
		}
	};
}
