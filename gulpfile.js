var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('buildmin', function() {
    gulp.src(['./src/ionic-ajax-interceptor.module.js', './src/ionic-ajax-interceptor.provider.js'])
        .pipe(concat('ionic-ajax-interceptor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'))
});


gulp.task('build', function() {
    gulp.src(['./src/ionic-ajax-interceptor.module.js', './src/ionic-ajax-interceptor.provider.js'])
        .pipe(concat('ionic-ajax-interceptor.js'))
        .pipe(gulp.dest('./dist/'))
});

gulp.task('watch', function() {
    gulp.watch('./src/*', ['build', 'buildmin']);
});