var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var src = [
    './src/ionic-ajax-interceptor.module.js',
    './src/ionic-ajax-interceptor.provider.js',
    './src/ionic-ajax-interceptor.service.js'
];

gulp.task('buildmin', function() {
    gulp.src(src)
        .pipe(concat('ionic-ajax-interceptor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'))
});

gulp.task('build', function() {
    gulp.src(src)
        .pipe(concat('ionic-ajax-interceptor.js'))
        .pipe(gulp.dest('./dist/'))
});

gulp.task('watch', function() {
    gulp.watch('./src/*', ['build', 'buildmin']);
});

gulp.task('default', ['build', 'buildmin']);
