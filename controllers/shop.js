const Product = require('../models/product');

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
                ID: id
            });
        })
        .catch(err => console.log(err));
}