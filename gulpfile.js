const { src, dest, parallel, series, watch}	= require( 'gulp');

const browserSync		= require( 'browser-sync').create();
const nunjucks			= require( 'gulp-nunjucks');
const htmlmin			= require( 'gulp-htmlmin');
const beautify			= require( 'gulp-beautify');
const sass				= require( 'gulp-sass');
const autoprefixer	= require('gulp-autoprefixer');
const cleanCss			= require( 'gulp-clean-css');

paths = {
	dist: 'dist/',
	src: 'src/',
	njk: 'njk/*.njk',
	sass: 'sass/main.sass',
	html: '',
	css: 'css/',
	watch: {
		njk: 'src/njk/**/*.njk',
		sass: 'sass/**/*.sass',
	},
}

function serverHost() {
	browserSync.init( {
		server: { baseDir: paths.dist },
		notify: false,
		online: true,
		https: true,
	})
}

function filesWatching() {
	watch( paths.src + paths.watch.njk, htmlProcessing);
	watch( paths.src + paths.watch.sass, cssProcessing);
}

function htmlProcessing() {
	return src( paths.src + paths.njk)
		.pipe( nunjucks.compile())
		.pipe( htmlmin( {
			collapseWhitespace: true,
		}))
		.pipe( dest( paths.dist + paths.html))
		.pipe( browserSync.stream())
}

function cssProcessing() {
	return src( paths.src + paths.sass)
		.pipe( sass())
		.pipe( autoprefixer( {
			overrideBrowserslist: [ 'last 10 versions'],
		}))
		.pipe( cleanCss( {
			level: {
				1: {
					specialComments: 0,
				}
			},
			format: 'uglify',
		}))
		.pipe( dest( paths.dist + paths.css))
		.pipe( browserSync.stream())
}

function beautifyFiles() {
	return src( paths.src + paths.njk)
		.pipe( nunjucks.compile())
		.pipe( beautify.html( { indent_with_tabs: true}))
		.pipe( dest( paths.dist + paths.html))
}

exports.beautifyFiles	= beautifyFiles;

exports.default	= parallel( htmlProcessing, cssProcessing, serverHost, filesWatching);