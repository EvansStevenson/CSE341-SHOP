const express = require('express');
const fs = require('fs');
const router = express.Router();
const adminController = require("../controllers/admin");

router.get('/', adminController.getAddProduct);
router.get('/:id', adminController.getEdit);
router.post('/submit', adminController.postAddProduct);
router.post('/edit', adminController.postEdit);
router.post('/delete', adminController.postDeleteProduct);
//router.post('/submit', adminController.postAddProduct);
//router.post('/edit', adminController.postEditProduct);

module.exports = router;