var helper = {};

helper.mainPage = async(req, res, next) => {
    res.render("index");
}

helper.handleQuery = async(req, res, next) => {
    let formdata = req.body;
    console.log(formdata.repoLink);
    console.log(formdata.subdomain);
    console.log(formdata.port);
    res.render('index');
}

module.exports = helper;