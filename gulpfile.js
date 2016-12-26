var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var plumber = require('gulp-plumber');
var data = require('gulp-data');
var rename = require('gulp-rename');
var stylus = require('gulp-stylus');
var autoPrefixer = require('gulp-autoprefixer');
var cssComb = require('gulp-csscomb');
var cmq = require('gulp-merge-media-queries');
var cleanCss = require('gulp-clean-css');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var jade = require('gulp-jade');
var clean = require('gulp-clean');
var imageMin = require('gulp-imagemin');
var cache = require('gulp-cache');


gulp.task('stylus',function(){
  gulp.src(['src/stylesheet/*.styl'])
    .pipe(plumber({
      handleError: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(stylus())
    .pipe(autoPrefixer())
    .pipe(cssComb())
    .pipe(cmq({log:true}))
    .pipe(gulp.dest('dist/stylesheet'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(cleanCss())
    .pipe(gulp.dest('dist/stylesheet'))
});

gulp.task('babel',function(){
  gulp.src(['src/javascript/*.js'])
    .pipe(plumber({
      handleError: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(babel())
    .pipe(gulp.dest('dist/javascript'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/javascript'))
});
gulp.task('jade',function(){
  gulp.src(['src/views/*.jade'])
    .pipe(plumber({
      handleError: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(data(function (file) {
      return require('./data.json');
    }))
    .pipe(jade())
    .pipe(gulp.dest('./dist/'))
});

gulp.task('image',function(){
  gulp.src(['src/images/**/*'])
    .pipe(imageMin())
    .pipe(gulp.dest('dist/images'))
});

gulp.task('clean', function () {
  return gulp.src('./dist', {read: false})
    .pipe(clean());
});

gulp.task('build', ['clean', 'babel', 'stylus', 'jade']);

gulp.task('default', function(){
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  gulp.watch('src/javascript/**/*.js',['babel']);
  gulp.watch('src/stylesheet/**/*.styl',['stylus']);
  gulp.watch('src/views//**/*.jade',['jade']);
  gulp.watch('src/images/**/*',['image']);
});