const { src, dest, parallel, series, watch}	= require( 'gulp');

const browserSync	= require( 'browser-sync').create();
const nunjucks		= require( 'gulp-nunjucks');
const htmlmin		= require( 'gulp-htmlmin');
const beautify		= require( 'gulp-beautify');

paths = {
	dist: 'dist/',
	njk: 'src/njk/*.njk',
}

function serverHost() {
	browserSync.init( {
		server: { baseDir: paths.dist },
		notify: false,
		online: true,
		https: true,
	})
}

function htmlProcessing() {
	return src( paths.njk)
		.pipe( nunjucks.compile())
		.pipe( htmlmin( {
			collapseWhitespace: true,
		}))
		.pipe( dest( paths.dist))
		.pipe( browserSync.stream())
}

function filesWatching() {
	watch( 'src/**/*.njk', htmlProcessing);
}

function beautifyFiles() {
	return src( 'src/**.njk')
		.pipe( nunjucks.compile())
		.pipe( beautify.html( { indent_with_tabs: true}))
		.pipe( dest( 'dist/'))
}

exports.serverHost		= serverHost;
exports.htmlProcessing	= htmlProcessing;
exports.beautifyFiles	= beautifyFiles;

exports.default	= parallel( htmlProcessing, serverHost, filesWatching);