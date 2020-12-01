const { src, dest, parallel, series, watch}	= require( 'gulp');

const browserSync		= require( 'browser-sync').create();
const nunjucks			= require( 'gulp-nunjucks');
const htmlmin			= require( 'gulp-htmlmin');
const beautify			= require( 'gulp-beautify');
const sass				= require( 'gulp-sass');
const autoprefixer	= require('gulp-autoprefixer');
const cleanCss			= require( 'gulp-clean-css');
const concat			= require( 'gulp-concat');
const uglify			= require( 'gulp-uglify-es').default;
const imageMin			= require( 'gulp-imagemin');
const newer				= require( 'gulp-newer');

paths = {
	dist: 'dist/',
	src: 'src/',
	njk: 'njk/*.njk',
	sass: 'sass/main.sass',
	js: 'js/**/*.js',
	img: 'img/**/*',
	html: '',
	css: 'css/',
	distJs: 'js/',
	distImg: 'img/',
	watch: {
		njk: 'src/njk/**/*.njk',
		sass: 'sass/**/*.sass',
		js: 'js/**/*.js',
		img: 'img/**/*',
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
	watch( paths.src + paths.watch.js, jsProcessing);
	watch( paths.src + paths.watch.img, imagesProcessing);
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

function jsProcessing() {
	return src( paths.src + paths.js)
	.pipe( concat( 'main.js'))
	.pipe( uglify())
	.pipe( dest( paths.dist + paths.distJs))
	.pipe( browserSync.stream())
}

function imagesProcessing() {
	return src( paths.src + paths.img)
	.pipe( newer( paths.dist + paths.distImg)) 
	.pipe( imageMin())
	.pipe( dest( paths.dist + paths.distImg))
}

function beautifyFiles() {
	return src( paths.src + paths.njk)
		.pipe( nunjucks.compile())
		.pipe( beautify.html( { indent_with_tabs: true}))
		.pipe( dest( paths.dist + paths.html))
}

exports.beautifyFiles	= beautifyFiles;

exports.default	= parallel( htmlProcessing, cssProcessing, jsProcessing, imagesProcessing, serverHost, filesWatching);