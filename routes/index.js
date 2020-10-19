const routes = require('express').Router();
const { getHomePage } = require('../controllers/home');
const admin = require('./admin');
const shop = require('./shop');

routes.get('/', getHomePage);
routes.use('/admin', admin);
routes.use('/shop', shop);

module.exports = routes;