const express = require('express');
const fs = require('fs');
const router = express.Router();
const authController = require("../controllers/auth");
const { check, body } = require('express-validator');
const User = require('../models/user')


router.get('/', authController.getLogIn);
router.post('/login', authController.postLogIn);
router.post('/logout', authController.postLogOut);
router.get('/signup', authController.getsignup);

router.post('/signup/submit',
 check('email').isEmail().withMessage("Please enter a valid email").custom((value, {req}) => {
    return User.findOne({ email: value })
    .then(userDoc => {
        if (userDoc) {
           return Promise.reject("This email already exists, please enter another one");
        }
    })
 }).normalizeEmail(), 
 body('password').isLength({min: 5}).withMessage("Password must be at least 5 characters long").trim(),
 body('confirmPassword').trim().custom((value, {req}) => { //how is req pulled?
    if (value !== req.body.password){
        throw new Error('Passwords did not match');
    }
    return true;
 }),
authController.postsignup);

router.get('/reset', authController.getReset);
router.post('/reset',
check('email').isEmail().withMessage("Please enter a valid email").custom((value, {req}) => {
   return User.findOne({ email: value })
   .then(userDoc => {
       if (!userDoc) {
          return Promise.reject("This email does not exist in our system, please enter another one");
       }
   })
}).normalizeEmail(),
authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/newpassword',
body('password').isLength({min: 5}).withMessage("Password must be at least 5 characters long").trim(),
body('confirmPassword').trim().custom((value, {req}) => { //how is req pulled?
    if (value !== req.body.password){
        throw new Error('Passwords did not match');
    }
    return true;
 }),
 authController.postNewPassword);

module.exports = router;