const routes = require('express').Router();
const { getHomePage } = require('../controllers/home');
const admin = require('./admin');
const shop = require('./shop');
const auth = require('./auth');

routes.get('/', getHomePage);
routes.use('/admin', admin);
routes.use('/shop', shop);
routes.use('/auth', auth);

module.exports = routes;