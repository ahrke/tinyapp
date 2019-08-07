const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW", count: 5 },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW", count: 13 },
  b2xVn2: { longURL: "http://www.lighthouselabs.ca", userID: "tinyURL", count: 50 },
  "9sm5xK": { longURL: "http://www.strongbadia.com", userID: "tinyURL", count: 1532097243 }
};

module.exports = {
  all: () => urlDatabase,
  add: (tinyURL, urlObj) => {
    urlDatabase[tinyURL] = urlObj;
    urlDatabase[tinyURL].count = 0;
  },
  getUserURLs: (user) => {
    let userURLs = [];
    Object.keys(urlDatabase).filter(url => urlDatabase[url].userID === user).forEach(u => {
      let obj = {
        shortURL: u,
        longURL: urlDatabase[u].longURL
      };
      userURLs.push(obj);
    });
    return userURLs;
  },
  doesUrlExist: (shortURL) => {
    return Object.keys(urlDatabase).includes(shortURL);
  },
  addCountFor: (shortURL) => {
    urlDatabase[shortURL].count += 1;
    console.log('the count is...',urlDatabase[shortURL].count);
  }
};