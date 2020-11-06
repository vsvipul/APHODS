var helper = {};

helper.mainPage = async(req, res, next) => {
    res.render("index");
}

module.exports = helper;