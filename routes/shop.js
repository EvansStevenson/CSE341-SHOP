const express = require('express');
const fs = require('fs');
const router = express.Router();
const shopController = require("../controllers/shop");
const isAuth = require('../middleware/isAuth');


router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.post('/cart/delete', isAuth, shopController.postCartDelete);
router.get('/orders', isAuth, shopController.getOrder);
router.post('/cart/order', isAuth, shopController.postOrder);
router.get('/:id', shopController.getInfo);
router.get('/', shopController.getProducts);

module.exports = router;