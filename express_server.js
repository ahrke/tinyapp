const express = require('express');
const app = express();

const PORT = 3000;


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/urls', (req, res) => {
  let templateVars = {
    urls: urlDatabase
  }
  res.render('urlsIndex', templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get('/whoa', (req,res) => {
  res.render('whoa');
});

app.get('/path/:where', (req, res) => {
  let arg = res.params.where;

})

app.listen(PORT, () => {
  console.log('Example app listening to port:',PORT);
});