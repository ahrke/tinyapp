const users = { 
  "aJ48lW": {
    name: "General Cacti",
    id: "aJ48lW", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    name: "Captain Benedict Cabbagepatch",
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

module.exports = {
  all: () => { return users },
  add: (user) => { users[user.id] = user },
  getUser: (userId) => {
    let user = Object.keys(users).filter(user => user === userId);
    return users[user];
  },
  getValueFromUser: (id, field) => {
    if (!users[id]) {
      return undefined;
    } else {
      return users[id][field];
    }
  },
  getUserWhereValueIs: (field, value) => {
    let user = Object.keys(users).filter(u => users[u][field] === value);
    return user ? users[user] : undefined;
  }
}