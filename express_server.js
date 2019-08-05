const express = require('express');
const app = express();

const PORT = 3000;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/', (req, res) => {
  res.send('Welcome to my page!\n<br><br><br><img src="https://http.cat/200" />');
});

app.get('/whoa', (req,res) => {
  let randomCatStatus = Math.floor(Math.random() * Math.floor(51)) + 400;
  res.send('<h1>supposed to have something here...</h1><br><img src="https://http.cat/' + randomCatStatus + '" /><br><h2>did we get anything with ' + randomCatStatus + '?</h2>');
})

app.listen(PORT, () => {
  console.log('Example app listening to port:',PORT);
});