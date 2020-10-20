const express = require('express');
const fs = require('fs');
const router = express.Router();
const authController = require("../controllers/auth");

router.get('/', authController.getLogIn);
router.post('/login', authController.postLogIn);
router.post('/logout', authController.postLogOut);
router.get('/signup', authController.getsignup);
router.post('/signup/submit', authController.postsignup);

module.exports = router;