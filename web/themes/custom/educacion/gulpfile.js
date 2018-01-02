var gulp = require("gulp");
var $ = require('gulp-load-plugins')();
var sass = require("gulp-sass");
var filter = require('gulp-filter');
var gcmq = require('gulp-group-css-media-queries');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require("browser-sync");
var reload = browserSync.reload;

// sass task
gulp.task('sass', function () {
  return gulp.src('scss/global.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      //outputStyle: 'compressed',
      outputStyle: 'nested',
      includePaths: ["./node_modules/foundation-sites/scss"],
      precision: 10,
      onError: function (err) {
        notify().write(err);
      }
    }).on('error', function(error) {
        console.log(error);
        this.emit('end');
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9','Safari 5']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css'))
    .pipe(gcmq())
    .pipe(filter('css**/*.css')) // Filtering stream to only css files
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('editor', function () {
    return gulp.src('scss/ckeditor.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            //outputStyle: 'compressed',
            outputStyle: 'nested',
            includePaths: ["./node_modules/foundation-sites/scss"],
            precision: 10,
            onError: function (err) {
                notify().write(err);
            }
        }).on('error', function(error) {
            console.log(error);
            this.emit('end');
        }))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9','Safari 5']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('css'))
        .pipe(gcmq())
        .pipe(filter('css**/*.css')) // Filtering stream to only css files
        .pipe(browserSync.reload({stream: true}));
});


// process JS files and return the stream.
gulp.task('js', function () {
  return gulp.src('js/*js')
    .pipe(gulp.dest('js'));
});

// BrowserSynk
gulp.task('browser-sync', function () {
  //initialize browsersync
  browserSync.init({
    //browsersync with a php server
    proxy: "educacion.dev:8081",
    notify: true
  });
});


// Watch files for changes
gulp.task('watch', function () {
  gulp.watch('scss/**/*', ['sass', reload]);
  gulp.watch('js/**/*', [reload]);
  gulp.watch('img/**/*', [reload]);
  gulp.watch('templates/*.twig', [reload]);
});


// Default task to be run with `gulp`
gulp.task('default', ['sass', 'js', 'browser-sync'], function () {
  gulp.watch("scss/**/*.scss", ['sass']);
  gulp.watch("js/*.js", ['js']);
});

gulp.task('default', ['sass', 'js', 'browser-sync', 'watch']);
