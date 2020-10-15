const { src, dest, parallel, series, watch}	= require( 'gulp');

const browserSync	= require( 'browser-sync').create();
const nunjucks		= require( 'gulp-nunjucks');
const htmlmin		= require( 'gulp-htmlmin');
const beautify		= require( 'gulp-beautify');

function browserSyncFunction() {
	browserSync.init( {
		server: { baseDir: 'dist/'},
		notify: false,
		online: true,
	})
}

function htmlProcessingFunction() {
	return src( 'src/**.njk')
		.pipe( nunjucks.compile())
		.pipe( htmlmin( {
			collapseWhitespace: true,
		}))
		.pipe( dest( 'dist/'))
		.pipe( browserSync.stream())
}

function watchingFunction() {
	watch( 'src/**/*.njk', htmlProcessingFunction);
}

function beautifyFunction() {
	return src( 'src/**.njk')
		.pipe( nunjucks.compile())
		.pipe( beautify.html( { indent_with_tabs: true}))
		.pipe( dest( 'dist/'))
}

exports.browserSyncFunction		= browserSyncFunction;
exports.htmlProcessingFunction	= htmlProcessingFunction;
exports.beautifyFunction			= beautifyFunction;

exports.default	= parallel( htmlProcessingFunction, browserSyncFunction, watchingFunction);