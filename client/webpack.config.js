const webpack = require( 'webpack' );
const path = require( 'path' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const ScriptExtHtmlWebpackPlugin = require( 'script-ext-html-webpack-plugin' );
const PreloadWebpackPlugin = require( 'preload-webpack-plugin' );
const UglifyJSPlugin = require( 'uglifyjs-webpack-plugin' );
const SWPrecacheWebpackPlugin = require( 'sw-precache-webpack-plugin' );
const jsonEnvironment = require( './environment.json' );

// replace localhost with 0.0.0.0 if you want to access
// your app from wifi or a virtual machine
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
const sourcePath = path.join( __dirname, './src' );
const buildDirectory = path.join( __dirname, './build' );

const stats = {
	assets: true,
	children: false,
	chunks: false,
	hash: false,
	modules: false,
	publicPath: false,
	timings: true,
	version: false,
	warnings: true,
	colors: {
		green: '\u001b[32m',
	},
};

module.exports = function( env ) {
	const nodeEnv = env && env.prod ? 'production' : 'development';
	const isProductin = nodeEnv === 'production';
	const serviceWorkerBuild = env && env.sw;
	const htmlTemplate = isProductin ? 'index.prod.ejs' : 'index.dev.ejs';
	
	let cssLoader;
	
	const plugins = [
		new webpack.optimize.CommonsChunkPlugin( {
			async: true,
			children: true,
			minChunks: 2,
		} ),
		
		// setting production environment will strip out
		// some of the development code from the app
		// and libraries
		new webpack.DefinePlugin( {
			'process.env': { NODE_ENV: JSON.stringify( nodeEnv ) },
			'$__WebPackConfig': JSON.stringify( jsonEnvironment )
		} ),
		
		// create css bundle
		new ExtractTextPlugin( 'style-[contenthash:8].css' ),
		
		// create index.html
		new HtmlWebpackPlugin( {
			template: htmlTemplate,
			inject: true,
			production: isProductin,
			minify: isProductin && {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			},
		} ),
		
		// make sure script tags are async to avoid blocking html render
		new ScriptExtHtmlWebpackPlugin( {
			defaultAttribute: 'async',
		} ),
		
		// preload chunks
		new PreloadWebpackPlugin(),
	];
	
	if( isProductin ) {
		plugins.push(
			// minify remove some of the dead code
			new UglifyJSPlugin( {
				compress: {
					warnings: false,
					screw_ie8: true,
					conditionals: true,
					unused: true,
					comparisons: true,
					sequences: true,
					dead_code: true,
					evaluate: true,
					if_return: true,
					join_vars: true,
					//  keep_classnames: true
				},
			} )
		);
		
		cssLoader = ExtractTextPlugin.extract( {
			fallback: 'style-loader',
			use: [
				{
					loader: 'css-loader',
					options: {
						module: true, // css-loader 0.14.5 compatible
						modules: true,
						localIdentName: '[hash:base64:5]',
					},
				},
				{
					loader: 'sass-loader',
					options: {
						outputStyle: 'collapsed',
						sourceMap: true,
						includePaths: [ sourcePath ],
					},
				},
			],
		} );
	} else {
		plugins.push(
			// make hot reloading work
			new webpack.HotModuleReplacementPlugin(),
			// show module names instead of numbers in webpack stats
			new webpack.NamedModulesPlugin(),
			// don't spit out any errors in compiled assets
			new webpack.NoEmitOnErrorsPlugin()
		);
		
		cssLoader = [
			{
				loader: 'style-loader',
			},
			{
				loader: 'css-loader',
				options: {
					module: true,
					//  localIdentName: '[path][name]-[local]',
					localIdentName: '[local]',
				},
			},
			{
				loader: 'sass-loader',
				options: {
					outputStyle: 'expanded',
					sourceMap: false,
					includePaths: [ sourcePath ],
				},
			},
		];
	}
	
	if( serviceWorkerBuild ) {
		plugins.push(
			new SWPrecacheWebpackPlugin( {
				cacheId: 'budgeting-app',
				filename: 'sw.js',
				maximumFileSizeToCacheInBytes: 800000,
				mergeStaticsConfig: true,
				minify: true,
				runtimeCaching: [
					{
						handler: 'cacheFirst',
						urlPattern: /(.*?)/,
					},
				],
			} )
		);
	}
	
	const entryPoint = isProductin
		? './index.js'
		: [
		// activate HMR for React
		'react-hot-loader/patch',
		
		// bundle the client for webpack-dev-server
		// and connect to the provided endpoint
		`webpack-dev-server/client?http://${host}:${port}`,
		
		// bundle the client for hot reloading
		// only- means to only hot reload for successful updates
		'webpack/hot/only-dev-server',
		
		// the entry point of our app
		'./index.js',
	];
	
	return {
		devtool: isProductin ? 'source-map' : 'cheap-module-source-map',
		context: sourcePath,
		entry: {
			main: entryPoint,
		},
		output: {
			path: buildDirectory,
			publicPath: '/',
			filename: '[name]-[hash:8].js',
			chunkFilename: '[name]-[chunkhash:8].js',
		},
		module: {
			rules: [
				{
					test: /\.(html|svg|jpe?g|png?)$/,
					exclude: /node_modules/,
					use: {
						loader: 'file-loader',
						options: {
							name: 'static/[name].[ext]',
						},
					},
				},
				{
					test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
					loader: 'file-loader?name=fonts/[name].[ext]'
				},
				{
					test: /\.scss$/,
					exclude: /node_modules/,
					use: cssLoader,
				},
				{
					test: /\.less$/,
					use: ExtractTextPlugin.extract( {
						fallback: 'style-loader',
						use: [ "css-loader", "less-loader" ],
					} )
				},
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: [ 'babel-loader' ],
				},
				{
					test: /\.json$/,
					use: 'json-loader'
				}
			],
		},
		resolve: {
			extensions: [ '.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx' ],
			modules: [ path.resolve( __dirname, 'node_modules' ), sourcePath ],
		},
		plugins,
		performance: isProductin && {
			maxAssetSize: 300000,
			maxEntrypointSize: 300000,
			hints: 'warning',
		},
		stats: stats,
		devServer: {
			contentBase: './src',
			publicPath: '/',
			historyApiFallback: true,
			port: port,
			host: host,
			hot: ! isProductin,
			compress: isProductin,
			stats: stats,
		},
	};
};
