const gulp       = require('gulp');
const webpack    = require('gulp-webpack');
const sourcemaps = require('gulp-sourcemaps');
const babel      = require('gulp-babel');
const concat     = require('gulp-concat');
const uglify     = require('gulp-uglify');
const rename     = require('gulp-rename');

var sass = require('gulp-sass');
const autoprefixer  = require('autoprefixer');
// ^^^ awesome places to start ^^^

const cssnano = require('gulp-cssnano');
const gulpStylelint = require('gulp-stylelint');

const data = require('gulp-data');
const htmlmin = require('gulp-htmlmin');

const njRender    = require('gulp-nunjucks-render');
const nj       = njRender.nunjucks;

const browserSync   = require('browser-sync');
const reload        = browserSync.reload;

// De-caching for Data files
function requireUncached( $module ) {
  delete require.cache[require.resolve( $module )];
  return require( $module );
}

gulp.task('vendors', function () {
  return gulp.src('src/scripts/vendor/**/*.js')
    .pipe(gulp.dest('dist/static'));
});
 
gulp.task('scripts', () => {
  return gulp.src('src/scripts/app.js')
    .pipe(webpack())
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(rename('app.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
    .pipe(reload({stream:true}));
});

gulp.task('sass', function () {
  return gulp.src('src/**/*.scss')
    .pipe(sass())
    .pipe(cssnano({
      autoprefixer: {add: true}
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('markup', () => {
  nj.configure(['src/templates'], {watch: false});
  return gulp.src('src/html/**/*.+(html|nj|nunjucks)')
    .pipe(data(function () {
      return requireUncached('./src/data/data.json')
    }))
    .pipe(njRender())
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('src/images/**/*.+(gif|jpg|png|svg)')
    .pipe(gulp.dest('dist/images'));
});

gulp.task('assets', () => {
  return gulp.src('src/assets/**/*.+(gif|jpg|png|svg|mp4)')
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('fonts', () => {
  return gulp.src('src/styles/fonts/**/*.+(ttf|woff|woff2)')
    .pipe(gulp.dest('dist/styles/fonts'));
});

gulp.task("lint:css", function () {
  return gulp.src("src/**/*.css")
    .pipe(gulpStylelint({
      reporters: [
        {formatter: 'string', console: true}
      ]
    }));
});

gulp.task('watch', function() {
  gulp.watch('src/templates/**/*.+(html|nj|nunjucks)', ['markup', reload]);
  gulp.watch('src/html/**/*.+(html|nj|nunjucks)', ['markup', reload]);
  gulp.watch('src/data/**/*.+(json)', ['markup', reload]);
  gulp.watch('src/**/*.scss', ['sass', reload]);
  gulp.watch(['src/scripts/**/*.js'], ['scripts', reload]);
  gulp.watch(['src/images/**/*.+(gif|jpg|png|svg)'], ['images', reload]);
  gulp.watch(['src/assets/**/*.+(gif|jpg|png|svg)'], ['assets', reload]);
  gulp.watch("*.html", reload);
});

gulp.task('sync', function() {
  browserSync({
    server: {
      baseDir: "./dist/"
    },
    port: 3400
  });
});

gulp.task('server', [
  'markup',
  'sass',
  'lint:css',
  'images',
  'assets',
  'fonts',
  'sync',
  'vendors',
  'scripts',
  'watch'
]);

gulp.task('default', [
  'markup',
  'sass',
  'images',
  'assets',
  'fonts',
  'vendors',
  'scripts'
]);
