var express = require('express');
var path = require('path');
var debug = require("debug");
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var methodOverride = require('method-override');
var app = express();
var router = express.Router();

var Animal = require('./models/animals')

var moongoose = require('mongoose');
moongoose.connect('mongodb://localhost/animalshelter');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');



var bobo = Animal({
  name: 'Bobo',
  breed: 'yorkshire terrier',
  status: 'abandoned'
})

var dobo = Animal({
  name: 'Dobo',
  breed: 'alsatian',
  status: 'adopted'
})

bobo.save(function(err, animal) {
  if (err) console.log(err);
  console.log('Animal ' + animal.name + ' has been created');
})

dobo.save(function(err, animal) {
  if (err) console.log(err);
  console.log('Animal ' + animal.name + ' has been created');
})


// Animal.find({}, function(err, animals){
//   if (err) console.log(err);
//   console.log(animals);
//   })

var animals2;

Animal.find({}, function(err, animals){
  if (err) console.log(err);
  animals2 = animals;
  console.log('animals2 = ' + animals2)
  })



app.get('/', function(req, res){
  // res.send(animals2)
  //res.json(animals)
  res.render('index.ejs', {
    animals2: animals2
  });

})



// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.listen(3000)