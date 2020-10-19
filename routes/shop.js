const express = require('express');
const fs = require('fs');
const router = express.Router();
const shopController = require("../controllers/shop");

router.get('/', shopController.getProducts);
router.get('/:id', shopController.getInfo);

module.exports = router;