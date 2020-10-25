const Product = require('../models/product');
const { validationResult } = require('express-validator');

exports.getAddProduct = (req, res) => {
  Product.find({ userId: req.user._id })
    .then(products => {
      res.render('pages/admin', {
        pageTitle: 'Add Product',
        path: '/admin',
        prods: products,
        oldImput: { title: "", description: "", price: "", imgUrl: "" },
        errorMessages: []
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/500');
    });
};
//https://drive.google.com/uc?id=


exports.postAddProduct = (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const tag = req.body.tag;
  const imgUrl = req.body.imgUrl;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("made it into if statement");
    Product.find({ userId: req.user._id })
      .then(products => {
        res.status(422).render('pages/admin', {
          pageTitle: 'Add Product',
          path: '/admin',
          prods: products,
          errorMessages: errors.array(),
          oldImput: { title: title, description: description, price: price, imgUrl: imgUrl }
        })
      }).catch(err => {
        console.log(err);
        res.redirect('/500');
      })
  }
  else {
    const product = new Product({ title: title, description: description, price: price, tag: tag, imgUrl: imgUrl, userId: req.user._id });
    product.save()
      .then(result => {
        res.redirect('/admin');
      })
      .catch(err => {
        console.log(err);
        res.redirect('/500');
      });
  }
};

exports.getEdit = (req, res) => {
  let title = "";
  let price = 0;
  let description = "";
  let imgUrl = "";
  let tag = "";
  let id = req.params.id;
  Product.findById(id).then(product => {
    title = product.title;
    price = product.price;
    description = product.description;
    imgUrl = product.imgUrl;
    tag = product.tag;
  })
    .then(result => {
      //console.log(title + price + description + imgUrl + id)
      res.render('pages/editProduct', {
        pageTitle: 'Edit Detail',
        path: '/shop',
        itemT: title,
        itemP: price,
        itemD: description,
        itemI: imgUrl,
        ID: id,
        TAG: tag,
        errorMessages: []
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect('/500');
    });
};

exports.postEdit = (req, res) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imgUrl;
  const updatedTag = req.body.tag;
  const updatedDesc = req.body.description;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let title = updatedTitle;
    let price = updatedPrice;
    let description = updatedDesc;
    let imgUrl = updatedImageUrl;
    let tag = updatedTag;
    let id = prodId;

    res.status(422).render('pages/editProduct', {
      pageTitle: 'Edit Detail',
      path: '/shop',
      itemT: title,
      itemP: price,
      itemD: description,
      itemI: imgUrl,
      ID: id,
      TAG: tag,
      errorMessages: errors.array()
    });

  }
  else {
    Product.findById(prodId)
      .then(product => {
        if (product.userId.toString() !== req.user._id.toString()) {
          return res.redirect('/');
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        product.imgUrl = updatedImageUrl;
        product.tag = updatedTag;
        return product.save()
          .then(result => {
            console.log('UPDATED PRODUCT!');
            res.redirect('/admin');
          })
      })
      .catch(err => {
        console.log(err);
        res.redirect('/500');
      });
  }
};

exports.postDeleteProduct = (req, res) => {
  const prodId = req.body.deleteId
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      console.log('REMOVED PRODUCT!' + prodId);
      res.redirect('/admin');
    })
    .catch(err => {
      console.log(err);
      res.redirect('/500');
    });
};