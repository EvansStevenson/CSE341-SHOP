const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000
const app = express();
const routes = require('./routes')
const errorController = require('./controllers/404');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user');


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
const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://Evans:evanspassword@mainshop.xcqkz.mongodb.net/localShop?retryWrites=true&w=majority";

app.use((req, res, next) => {
  User.findById('5f8cf96bbc8ea10630743d16')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
})

app.use
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser({ extended: false })); // For parsing the body of a POST
app.use('/', routes);
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URL, options)
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Evans',
          email: 'evanstevenson860@gmail.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    })
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  })
  .catch(err => {
    console.log(err);
  });

