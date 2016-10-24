var gulp = require('gulp');
var	sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin');
var extender = require('gulp-html-extend');
var browserSync = require('browser-sync');
var changed = require('gulp-changed');
var concat = require('gulp-concat');



gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss') 
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest('app/css'))
});

gulp.task('build', function () {
    return gulp.src('app/*.html')
    .pipe(changed('app/**/*.+(html|css|js)'))
    .pipe(extender({annotations:true,verbose:false}))
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', cleanCSS()))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


gulp.task('imagemin', function (){
    return gulp.src('app/img/**/*')
    .pipe(changed('dist/img'))
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'dist'
    },
  })
});


gulp.task('default', ['browserSync','sass','build','imagemin'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch(['app/**/*.+(html|css|js)'], ['build']);
  gulp.watch(['app/img/**/*'], ['imagemin']);  
});