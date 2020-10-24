const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res) => {
    Product.find()
        .then(products => {
            res.render('pages/products', {
                pageTitle: 'Products',
                path: '/products',
                prods: products,
            });
        })
        .catch(err => { console.log(err); })
};

exports.getInfo = (req, res) => {
    let title = "";
    let price = 0;
    let description = "";
    let imgUrl = "";
    let id = req.params.id;
    Product.findById(id).then(product => {
        title = product.title;
        price = product.price;
        description = product.description;
        imgUrl = product.imgUrl;
    })
        .then(result => {
            //console.log(title + price + description + imgUrl + id)
            res.render('pages/productDetail', {
                pageTitle: 'Product Detail',
                path: '/shop',
                itemT: title,
                itemP: price,
                itemD: description,
                itemI: imgUrl,
                ID: id,
            });
        })
        .catch(err => console.log(err));
}

exports.getCart = (req, res) => {
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            //console.log("is this going to work: " + user.cart.items);
            res.render('pages/cart', {
                cartItems: user.cart.items,
                path: '/admin',
            });
        })
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    console.log("the product id is: " + req.body.productId);
    Product.findById(prodId)
        .then(product => {
            //console.log(product);
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/shop/cart');
        })
        .catch(err => {
            console.log(err);
        })
};

exports.postCartDelete = (req, res) =>{
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId)
    .then(result => {
        res.redirect('/shop/cart');
    })
    .catch(err => {console.log(err);})
}


exports.getOrder = (req, res) => {
    Order.find({'user.userId': req.user._id}).then(orders => {
        console.log(orders);
        res.render('pages/orders', {
            path: '/shop/order',
            pageTitle: "Your Orders",
            orders: orders
        });
    });
}

exports.postOrder = (req, res) => {
    req.user.populate('cart.items.productId')
    .execPopulate()
    .then(user => {
        const products = user.cart.items.map(item => {
            return {quantity: item.quantity, productData: { ...item.productId._doc} };
        });
        const order = new Order({
            user: 
            {
                email: req.user.email,
                userId: req.user
            },
            products: products
        });
        order.save();
    })
    .then(result => {
        req.user.clearCart();
    })
    .then(() => { //needs to be in new .then so that the page does not load before the cart is cleared
        res.redirect('/shop/orders');
    })
    .catch(err => {
        console.log(err);
    })
}

