const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();
const maintenanceMode = false;
const port = process.env.PORT || 3010;

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs'); // set express related configurations


app.use((req, res, next) => { // next is used to tell express when middleware is done
  /*Logger function: log requests*/
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log.');
    }
  });
  next();
});

app.use((req, res, next) => { //bypasses all other .get functions
  if (maintenanceMode) res.render('maintenance');
  next();
});

app.use(express.static(__dirname + '/public')); // Middleware is used in app.use().

hbs.registerHelper('getCurrentYear', () => { // function is executed when called from hbs file
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => { // function is executed when called from hbs file
  return text.toUpperCase();
});

app.get('/', (req, res) => { // set up handler for http get request. ('url (/=root)', function to run on request)
res.render('home.hbs', {
  pageTitle: 'Home Page',
  welcomeMessage: 'Welcome to my website'
});
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
    // currentYear: new Date().getFullYear()
  }); // render template and inject values into HTML
});

app.get('/bad', (req, res) => {

  res.send({
    errorMessage: 'Unable to handle request'
  })
});


app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
