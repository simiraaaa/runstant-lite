var gulp = require('gulp');
var riot = require('gulp-riot');
var concat = require('gulp-concat');
var webserver = require('gulp-webserver');
var server = require('gulp-express');

var target = ['./tags/editor/*.jade', './tags/editor/**/*.jade'];
var output = 'public/scripts';

gulp.task('riot', function() {
  gulp
    .src(target)
    .pipe(riot({template:'jade'}))
    // .pipe(gulp.dest(output))
    .pipe(concat('editor.tags.js'))
    .pipe(gulp.dest(output))
    ;
});

gulp.task('watch', function(){
  gulp.watch(target, ['riot']);
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

gulp.task('server', function() {
  server.run(['server.js']);
});


gulp.task('default', ['watch', 'server']);
