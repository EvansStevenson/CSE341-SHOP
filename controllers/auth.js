const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));

exports.getLogIn = (req, res) => {
    res.render('pages/login', {
        path: "/login",
        pageTitle: 'Login',
        errorMessage: "",
        oldEmail: ""
    });
}

exports.postLogIn = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(422).render('pages/login', {
                    errorMessage: "Invalid email or password",
                    oldEmail: email
                });
            }
            bcrypt.compare(password, user.password).then(result => {
                if (result) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save(err => {
                        res.redirect('/');
                    })
                }
                res.status(422).render('pages/login', {
                    errorMessage: "Invalid email or password",
                    oldEmail: email
                });
            }).catch(err => {
                res.status(422).render('pages/login', {
                    errorMessage: "Invalid email or password",
                    oldEmail: email
                });
            })
        })
}

exports.postLogOut = (req, res) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}

exports.getsignup = (req, res) => {
    res.render('pages/signup', {
        path: "/login",
        pageTitle: 'Login',
        errorMessages: [],
        oldEmail: ''
    });
}

exports.postsignup = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    //console.log("email errors: " + errors.isEmpty())
    if (errors.isEmpty() === false) {
        return res.status(422).render('pages/signup', {
            errorMessages: errors.array(),
            oldEmail: email
        });
    }

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            });
            return user.save();
        })

        .then(result => {
            res.redirect('/auth');
            return transporter.sendMail({
                to: email,
                from: 'stevensonevans@gmail.com',
                subject: "signup succeeded!",
                html: '<h1>Your account with Hyrule Armory has been created!</h1>'
            });
        })
}

exports.getReset = (req, res) => {
    res.render('pages/reset', {
        path: '/reset',
        pageTitle: 'reset password',
        error: "error",
        errorMessages: []
    })
}

exports.postReset = (req, res, next) => {
    const email = req.body.email;
    const errors = validationResult(req);
    if (errors.isEmpty() === false) {
        return res.status(422).render('pages/reset', {
            path: '/reset',
            pageTitle: 'reset password',
            errorMessages: errors.array(),
            oldEmail: email
        });
    }
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/auth/reset')
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email }).then(user => {
            user.resetToken = token;
            user.resetTokenExp = Date.now() + 3600000;
            return user.save();
        })
            .then(result => {
                res.redirect('/');
                transporter.sendMail({
                    to: req.body.email,
                    from: 'stevensonevans@gmail.com',
                    subject: "password Reset",
                    html: `
                        <p>You requested a password reset.</p>
                        <p>Click this <a href="http://localhost:5000/auth/reset/${token}">link</a> to set a new password!</p>
                    `
                });
            })
            .catch(err => {
                console.log(err);
                res.redirect('/500');
            });
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExp: { $gt: Date.now() } })
        .then(user => {
            res.render('pages/recovery', {
                path: '/recovery',
                pageTitle: 'recovery',
                error: "error",
                userId: user._id.toString(),
                passwordToken: token
            })
        }).catch(err => {
            console.log(err);
            res.redirect('/500');
        });

}

exports.postNewPassword = (req, res, next) => {
    const getNewPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne(
        {
            resetToken: passwordToken,
            resetTokenExp: { $gt: Date.now() },
            _id: userId
        }).then(user => {
            resetUser = user;
            return bcrypt.hash(getNewPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExp = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/auth');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/500');
        });
}