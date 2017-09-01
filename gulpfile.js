const gulp       = require('gulp');
const webpack    = require('gulp-webpack');
const sourcemaps = require('gulp-sourcemaps');
const babel      = require('gulp-babel');
const concat     = require('gulp-concat');
const uglify     = require('gulp-uglify');
const rename     = require('gulp-rename');

const postcss       = require('gulp-postcss');
const precss        = require('precss');
const autoprefixer  = require('autoprefixer');
const lost          = require('lost');
// ^^^ awesome places to start ^^^

const cssnano = require('gulp-cssnano');
const postcssSVG = require('postcss-svg');
const reporter = require('postcss-reporter');
const stylelint = require('stylelint');

const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
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

gulp.task('styles', () => {
  const processors = [
    precss(),
    lost,
    postcssFlexbugsFixes,
    postcssSVG({
      paths: ['src/assets/svg'],
      defaults: "[fill]: #000000"
    }),
    autoprefixer({browsers: ['last 2 versions']})
  ];
  return gulp.src('src/styles/styles.css')
    .pipe(postcss(processors))
    .pipe(cssnano({
      discardComments: {
        removeAll: false,
      }
    }))
    .pipe(gulp.dest('dist/styles'))
});

gulp.task('postcss', () => {
  const processors = [
    precss(),
    lost,
    postcssFlexbugsFixes,
    postcssSVG({
      paths: ['src/assets/svg'],
      defaults: "[fill]: #000000"
    }),
    autoprefixer({browsers: ['last 70 versions']})
  ];
  return gulp.src('src/styles/styles.css')
    .pipe(postcss(processors))
    .pipe(cssnano({
      discardComments: {
        removeAll: false,
      }
    }))
    .pipe(gulp.dest('dist/styles'))
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
    .pipe(postcss([
      stylelint({ /* your options */ }),
      reporter({ clearMessages: true }),
    ]))
});

gulp.task('watch', function() {
  gulp.watch('src/templates/**/*.+(html|nj|nunjucks)', ['markup', reload]);
  gulp.watch('src/html/**/*.+(html|nj|nunjucks)', ['markup', reload]);
  gulp.watch('src/data/**/*.+(json)', ['markup', reload]);
  gulp.watch('src/styles/**/*.css', ['styles', reload]);
  gulp.watch('src/styles/**/*.pcss', ['postcss', reload]);
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
    port: 3200
  });
});

gulp.task('server', [
  'markup',
  'styles',
  'postcss',
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
  'styles',
  'images',
  'assets',
  'fonts',
  'vendors',
  'scripts'
]);
