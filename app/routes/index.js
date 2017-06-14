var index = function index(req, res){
 res.render('index');
};

var postbackhandler = function postbackhandler(req, res){
 res.render('postbackhandler');
};

var error = function error(req, res){
 res.render('error');
};

module.exports.index = index;
module.exports.postbackhandler = postbackhandler;
module.exports.error = error;



