var gulp = require('gulp'),
  jade = require('gulp-jade'),
  localhost = require('browser-sync');

gulp.task('default', ['localhost']);

gulp.task('compile', ['js', 'jade']);

gulp.task('watch', ['compile'], function () {
  gulp.watch('src/**/*.jade', ['jade']);
  gulp.watch('src/**/*.js', ['js']);
});

gulp.task('jade', function () {
  return gulp.src('src/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('dest'));
});

gulp.task('js', function () {
  return gulp.src([
    'src/js/**/*.js'
  ])
    .pipe(gulp.dest('dest/js'));
});

gulp.task('localhost', ['watch'], function () {
  return localhost(['dest/*'], {
    server: 'dest/'
  });
});
