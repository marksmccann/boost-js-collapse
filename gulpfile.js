var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('dist', function() {
    gulp.src('src/collapse.js')
      .pipe(uglify())
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('dist'))
});

gulp.task('default',function() {
    gulp.watch('src/collapse.js',['dist']);
});
