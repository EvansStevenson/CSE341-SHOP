const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000
const app = express();
const routes = require('./routes')
const errorController = require('./controllers/404');
const mongoose = require('mongoose');
const session = require("express-session");
const mongodbStore = require('connect-mongodb-session')(session);
const cors = require('cors');
const User = require('./models/user');
const mongodbURI = 'mongodb+srv://Evans:evanspassword@mainshop.xcqkz.mongodb.net/localShop?retryWrites=true&w=majority';
const store = new mongodbStore({
  uri: mongodbURI,
  collection: 'sessions'
});

//cennect to heroku
const corsOptions = {
  origin: "https://cse341-shop.herokuapp.com/",
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  family: 4
};
const MONGODB_URL = process.env.MONGODB_URL || mongodbURI;


app.use
app.use(session({secret:'my secret', resave: false, saveUninitialized: false, store: store}));

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
   req.user = user;
   next();
  })
  .catch(err => console.log(err));
});


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser({ extended: false })); // For parsing the body of a POST
app.use('/', routes);
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URL, options)
  .then(result => {
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  })
  .catch(err => {
    console.log(err);
  });

