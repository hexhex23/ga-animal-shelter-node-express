var express = require('express');
var path = require('path');
var debug = require("debug");
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var helpers = require('express-helpers')
var methodOverride = require('method-override');
var app = express();
var router = express.Router();

var Animal = require('./models/animals')

var moongoose = require('mongoose');
moongoose.connect('mongodb://localhost/animalshelter');

//middleware to refresh page on reload
app.use(function noCacheForRoot(req, res, next) {
    if (req.url === '/animals') {
      res.header("Cache-Control", "no-cache, no-store, must-revalidate");
      res.header("Pragma", "no-cache");
      res.header("Expires", 0);
    }
    next();
});

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
helpers(app);


var bobo = Animal({
  name: 'Bobo',
  breed: 'yorkshire terrier',
  status: 'orphan'
});

var dobo = Animal({
  name: 'Dobo',
  breed: 'alsatian',
  status: 'adopted'
});

bobo.save(function(err, animal) {
if (err) console.log(err);
console.log('Animal ' + animal.name + ' has been created');
});

dobo.save(function(err, animal) {
  if (err) console.log(err);
  console.log('Animal ' + animal.name + ' has been created');
});

var allAnimals;


//INDEX
app.get('/animals', function(req, res){

  Animal.find({}, function(err, animals){
    if (err) console.log(err);
    allAnimals = animals;
    console.log('allAnimals = ' + animals)
    });
  res.render('index.ejs', {
    animals: allAnimals
  });

})

//SHOW
//NEW
//CREATE
//EDIT
//UPDATE
//ADOPT


//ABANDON
app.get('/animals/:id/abandon', function(req, res){

  var abandonedAnimal;
  var id = req.params.id;
  Animal.findByIdAndUpdate(id, { status: 'orphan' }, {new:true}, function(err, animal) {
      if (err) console.log(err);
      console.log (animal.name + 'is now' + animal.status);
      abandonedAnimal=animal;
      res.redirect('/animals')
      })
 
});

//ADOPT

app.get('/animals/:id/adopt', function(req, res){

  var adoptedAnimal;
  var id = req.params.id;
  Animal.findByIdAndUpdate(id, { status: 'adopted' }, {new:true}, function(err, animal) {
      if (err) console.log(err);
      console.log (animal.name + 'is now ' + animal.status);
      adoptedAnimal=animal;
      })
  res.render('index.ejs', {
    animals: allAnimals
  });
});
  



//DELETE




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