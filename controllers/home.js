exports.getHomePage = (req, res) => {
    res.render('../views/pages/home', {title: 'Welcome to my CSE341 shop', path: '/'});
 }