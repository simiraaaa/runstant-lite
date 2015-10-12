/*
 * server.js
 */

var express = require('express');
var path = require('path');
var app = express();

var yaml = require('js-yaml');
var fs   = require('fs');

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.logger('dev'));
app.use(express.compress());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res) {
  // res.send('hello world')
  res.render('editor', { title: 'Editor' });
});
app.get('/about', function(req, res) {
  res.render('about', { title: 'About' });
});
app.get('/user', function(req, res) {
  res.render('user', {
    title: 'User',
    pretty: true,
  });
});
app.get('/collections', function(req, res) {
  // var path = './public/data/collections/index.json';
  // var json = require(path);

  var path = './public/data/collections/index.yaml';
  var json = yaml.safeLoad(fs.readFileSync(path, 'utf8'));
  
  res.render('collections', {
    title: 'Collections',
    json: json,
    pretty: true,
  });
});
app.get('/collections/:id', function(req, res) {
  var json = require('./public/data/collections/'+req.params.id+'.json');
  res.render('list', {
    title: req.params.id,
    json: json,
    pretty: true,
  });
});

app.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
