const express = require('express');
const app = express();
const bodyParser = require("body-parser");

const PORT = 3000;

app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('urlsIndex');
});

app.get("/u/:shortURL", (req, res) => {
  // let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  // res.render("urls_show", templateVars);
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get('/urls', (req, res) => {
  let templateVars = {
    urls: urlDatabase
  }
  res.render('urlsIndex', templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  let urlShortened = generateRandomString();
  urlDatabase[urlShortened] = req.body.longURL;

  let templateVars = {
    urls: urlDatabase
  }
  console.log(templateVars)
  res.redirect('/urls/' + urlShortened);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect('/urls');
})

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

const generateRandomString = () => {
  const ALPHA = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  let urlStr = '';

  for (let i = 0; i < 6; i++) {
    urlStr += ALPHA[Math.floor(Math.random() * ALPHA.length)];
  }

  return urlStr;
}