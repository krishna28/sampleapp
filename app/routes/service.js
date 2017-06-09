
//used to import util module
var util = require('./customutil');
const u = require('util')

module.exports = function(app,express){
    
    var api = express.Router();

      /**
       * @name latest
       * @description
       *  end point to get latest exchange rate with USD as base currency
       */    

      api.get('/latest',function(req,res){
            var result = util.getLatest(function(err,response,data){
            if(!err){
              res.send(data);   
            }
           });           
        });

      /**
       * @name currencies
       * @description
       *  end point to get list of currencies available
       */  

      api.get('/currencies',function(req,res){
            var result = util.getCurrencies(function(err,response,data){
            if(!err){
              res.send(data);   
            }
           });
        });

      /**
       * @name history
       * @description
       *  end point to get history data given a date ass parameter
       */ 

      api.get('/handleResponse',function(req,res){


           console.log(u.inspect(req, {showHidden: false, depth: null}));
           console.log(u.inspect(res, {showHidden: false, depth: null}));
           res.send({"message":"hello"});
        });


      api.post('/handleResponse',function(req,res){


           console.log(u.inspect(req.body, {showHidden: false, depth: null}));
           res.send({"message":"hello"});
        });
    return api;

}