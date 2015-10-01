var gulp = require('gulp');
var riot = require('gulp-riot');
var concat = require('gulp-concat');
var webserver = require('gulp-webserver');
var server = require('gulp-express');

var target = {
  editor: ['./tags/editor/*.jade', './tags/editor/**/*.jade'],
  user: ['./tags/user/*.jade', './tags/user/**/*.jade'],
}
var output = 'public/scripts';

gulp.task('riot', function() {
  gulp
    .src(target.editor)
    .pipe(riot({template:'jade'}))
    .pipe(concat('editor.tags.js'))
    .pipe(gulp.dest(output))
    ;

  gulp
    .src(target.user)
    .pipe(riot({template:'jade'}))
    .pipe(concat('user.tags.js'))
    .pipe(gulp.dest(output))
    ;
});

gulp.task('watch', function(){
  gulp.watch(target.editor, ['riot']);
  gulp.watch(target.user, ['riot']);
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
