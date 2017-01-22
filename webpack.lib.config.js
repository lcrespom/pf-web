const path = require('path');

let prod = process.argv.indexOf('-p') !== -1;

module.exports = {
	devtool: 'source-map',
	entry: './src/yocto.ts',
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
		library: 'yocto',
		libraryTarget:'umd',
		path: path.resolve(__dirname, 'dist'),
		filename: prod ? 'yocto.min.js' : 'yocto.js'
	}
};
