const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogIn = (req, res) => {
    res.render('pages/login', {
        path: "/login",
        pageTitle: 'Login',
        error: req.flash('error')
    });
}

exports.postLogIn = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/auth')
            }
            bcrypt.compare(password, user.password).then(result => {
                if (result) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save(err => {
                        console.log(err);
                        res.redirect('/');
                    })
                }
                res.redirect('/auth');
            }).catch(err => {
                console.log(err);
                res.redirect('/auth');
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
        isAuth: false
    });
}

exports.postsignup = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                return res.redirect('/auth/signup');
            }
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] }
                    });
                    return user.save();
                })
        })
        .then(result => {
            res.redirect('/auth');
        })
        .catch(err => {
            console.log(err);
        });
}