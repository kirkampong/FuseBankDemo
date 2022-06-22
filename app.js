var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

users = ['kirk'];
balance = [{'username':'kirk','balance':20, 'lastUpdate':23123122}];
balanceCache = {}; // {{"12424323": [{"username":"kirk","balance":20,"lastUpdated":123122]}}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// User signs up : post
app.post('/signup',(request,response) => {  
  const username = request.body.username;
  users.push(username);
  const balanceEntry = {"username":username,"balance":0,lastUpdated:(new Date()).getTime()}
  balance.push(balanceEntry);
  console.log(users);
  response.send(200);
});

app.get('/getBalance',(request,response) => {
  const username = request.params.username
  const userBalance = balance.find((entry) => {
    return entry.username === username;
  })
  console.log(balance)
  response.send(userBalance.balance)
});

app.post('/deposit', (request, response) => {
  const depositAmount = request.params.amount;
  const username = request.params.username;
  console.log(balance);
  let userBalance = balance.find((entry) => {
    return entry.username === username;
  });
  userBalance.balance = userBalance.balance + depositAmount;
  userBalance.lastUpdated = (new Date()).getTime();
  response.send(200)
});

app.post('/transfer', (request, response) => {
  const transferAmount = request.params.amount;
  const username = request.params.username;
  const recipientName = request.params.recipientName;

  let recipientBalance = balance.find((entry) => {
    return entry.username === recipientName;
  })
  recipientBalance.balance = userBalance.balance + transferAmount;
  recipientBalance.lastUpdated = (new Date()).getTime();

  let senderBalance = balance.find((entry) => {
    return entry.username === username;
  })
  senderBalance.balance = senderBalance.balance - transferAmount;
  senderBalance.lastUpdated = (new Date()).getTime();

  response.send(200)
});

app.get('/getBalanceOnDate',(request,response) => {
  const username = request.username;
  const date = request.date;

  const balanceCacheEntry = balanceCache[date];
  let userBalance = balanceCacheEntry.find((entry) => {
    return entry.username === username;
  })
  response.send(userBalance.balance);
});


app.listen(3000, () => console.log('Example app is listening on port 3000.'));
module.exports = app;

