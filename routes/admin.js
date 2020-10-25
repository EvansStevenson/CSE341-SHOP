const express = require('express');
const fs = require('fs');
const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/isAuth");
const { check, body } = require('express-validator');
const User = require('../models/user');

router.get('/', isAuth, adminController.getAddProduct);
router.get('/:id', isAuth, adminController.getEdit);
router.post('/submit', isAuth,
check('title').isLength({min: 1}).withMessage("you must have a title"),
check('description').isLength({min: 1}).withMessage("you must have a description"),
check('price').isNumeric().withMessage('Needs to be a number'),
check('imgUrl').isURL().withMessage("needs to be a valid URL"),
adminController.postAddProduct);
router.post('/edit', 
check('title').isLength({min: 1}).withMessage("you must have a title"),
check('description').isLength({min: 1}).withMessage("you must have a description"),
check('price').isNumeric().withMessage('Needs to be a number'),
check('imgUrl').isURL().withMessage("needs to be a valid URL"),
isAuth, adminController.postEdit);
router.post('/delete', isAuth, adminController.postDeleteProduct);
//router.post('/submit', adminController.postAddProduct);
//router.post('/edit', adminController.postEditProduct);

module.exports = router;