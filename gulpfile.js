const { src, dest, parallel, series, watch}	= require( 'gulp');

const browserSync	= require( 'browser-sync').create();
const nunjucks		= require( 'gulp-nunjucks');
const htmlmin		= require( 'gulp-htmlmin');

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

exports.browserSyncFunction		= browserSyncFunction;
exports.htmlProcessingFunction	= htmlProcessingFunction;

exports.default	= parallel( htmlProcessingFunction, browserSyncFunction, watchingFunction);