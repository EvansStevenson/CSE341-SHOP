const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  if (!req.session.isLoggedIn){
    return res.redirect('/auth')
  }
  Product.find()
  .then(products => {
    res.render('pages/admin', {
      pageTitle: 'Add Product',
      path: '/admin',
      prods: products,
      isAuth: req.session.isLoggedIn
    });
  })
  .catch(err => {console.log(err);})
  };
  //https://drive.google.com/uc?id=





  exports.postAddProduct =(req, res) => {
    if (!req.session.isLoggedIn){
      return res.redirect('/auth')
    }
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const tag = req.body.tag;
    const imgUrl = req.body.imgUrl;
    //console.log(req.session.user._id);
    const product = new Product({title: title, description: description, price: price, tag: tag, imgUrl: imgUrl, userId: req.user._id});
    product.save()
      .then(result => {
        //console.log("created Product" + req.user._id);
        res.redirect("/admin");
      })
      .catch(err => {console.log(err);
      });
  };

  exports.getEdit = (req, res) =>{
    if (!req.session.isLoggedIn){
      return res.redirect('/auth')
    }
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
                isAuth: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
  };

  exports.postEdit = (req, res) => {
    if (!req.session.isLoggedIn){
      return res.redirect('/auth')
    }
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imgUrl;
    const updatedTag = req.body.tag;
    const updatedDesc = req.body.description;
  
    Product.findById(prodId).then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imgUrl = updatedImageUrl;
      product.tag = updatedTag;
      return product.save()
    })
      .then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin');
      })
      .catch(err => console.log(err));
  };
  
  exports.postDeleteProduct = (req, res) => {
    if (!req.session.isLoggedIn){
      return res.redirect('/auth')
    }
    const prodId = req.body.deleteId
    Product.findByIdAndRemove(prodId)
      .then(() => {
        console.log('REMOVED PRODUCT!' + prodId);
        res.redirect('/admin');
      })
      .catch(err => console.log(err));
  };