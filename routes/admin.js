const express = require('express');
const fs = require('fs');
const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/isAuth");

router.get('/', isAuth, adminController.getAddProduct);
router.get('/:id', isAuth, adminController.getEdit);
router.post('/submit', isAuth, adminController.postAddProduct);
router.post('/edit', isAuth, adminController.postEdit);
router.post('/delete', isAuth, adminController.postDeleteProduct);
//router.post('/submit', adminController.postAddProduct);
//router.post('/edit', adminController.postEditProduct);

module.exports = router;