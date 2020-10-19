const routes = require('express').Router();
//const models = require('./models');
//const ta = require('./ta');
//const proves = require('./proves');
//const shop = require('./shop');
const { getHomePage } = require('../controllers/home');

routes.get('/', getHomePage);
//routes.use('/ta', ta);
//routes.use('/proves', proves);
//routes.use('/shop', shop)

module.exports = routes;