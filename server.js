/*
 * server.js
 */

var express = require('express');
var path = require('path');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res) {
  // res.send('hello world')
  res.render('editor', { title: 'Express' });
});
app.get('/about', function(req, res) {
  res.render('about', { title: 'Express' });
});

app.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
