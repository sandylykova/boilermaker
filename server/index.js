const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./db/index');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const User = require('./db/models/user.js')
const app = express();
const dbStore = new SequelizeStore({ db: db });
dbStore.sync();
module.exports = app;

if (process.env.NODE_ENV === 'development') {
  require('../localSecrets'); // this will mutate the process.env object with your secrets.
}


// logging middleware
app.use(morgan('dev'));

// static middleware
app.use(express.static(path.join(__dirname, '../public')));

// body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', require('./api'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

//error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

//session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'bla bla',
  store: dbStore,
  resave: false,
  saveUninitialized: false
}));

//initialize Passport
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (err) {
    done(err);
  }
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(done);
});
