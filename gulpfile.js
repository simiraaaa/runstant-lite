var gulp = require('gulp');
var riot = require('gulp-riot');
var concat = require('gulp-concat');
var webserver = require('gulp-webserver');

gulp.task('riot', function() {
  gulp
    .src(['./tags/*.jade', './tags/**/*.jade'])
    .pipe(riot({template:'jade'}))
    .pipe(concat('tags.js'))
    .pipe(gulp.dest('public/scripts/'))
    ;
});

gulp.task('watch', function(){
  gulp.watch(['./tags/*.jade', './tags/**/*.jade'], ['riot']);
});

gulp.task('webserver', function() {
  gulp.src('./public')
    .pipe(webserver({
      livereload: true,
      // port: 9000,
      // directoryListing: true,
      // open: true,
    }));
});


gulp.task('default', ['watch', 'webserver']);
