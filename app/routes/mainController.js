'use strict'
  //used to import util module
  var mainService = require('./../services/mainService');
  const util = require('util');

  const verificationTypeObject = {

    "all":"https://gmi-apac.iwsinc.com/gmiserver/tenant/melco/app/GoVerifyID/template/GVID_VERIFY_ALL",
    "face":"https://gmi-apac.iwsinc.com/gmiserver/tenant/melco/app/GoVerifyID/template/GVID_VERIFY_FACE",
    "voice":"https://gmi-apac.iwsinc.com/gmiserver/tenant/melco/app/GoVerifyID/template/GVID_VERIFY_VOICE",
    "choice":"https://gmi-apac.iwsinc.com/gmiserver/tenant/melco/app/GoVerifyID/template/GVID_VERIFY_CHOICE",
    "facevoice":"https://gmi-apac.iwsinc.com/gmiserver/tenant/melco/app/GoVerifyID/template/GVID_VERIFY_FACEVOICE",
    "fingerprint":"https://gmi-apac.iwsinc.com/gmiserver/tenant/melco/app/GoVerifyID/template/GVID_VERIFY_FINGERPRINT",
    "yesno":"https://gmi-apac.iwsinc.com/gmiserver/tenant/melco/app/GoVerifyID/template/GVID_VERIFY_YESNO",
    "enroll":"https://gmi-apac.iwsinc.com/gmiserver/tenant/melco/app/GoVerifyID/template/ENROLL",
    "password":"https://gmi-apac.iwsinc.com/gmiserver/tenant/melco/app/GoVerifyID/template/GVID_RESET_PASSWORD",
    "gvidchoice":"https://gmi-apac.iwsinc.com/gmiserver/tenant/melco/app/GoVerifyID/template/GVID_VERIFY_CHOICEYN"

  }


  module.exports = function(app,express,eventEmitter,config){

    var api = express.Router();
    
    /**
     * @name verificationType
     * @description get all the list of verification type
    */
    api.get('/verificationType',function(req,res){
      res.json(verificationTypeObject);
    });

        /**
         * @name verify
         * @description end point to verify the user details
         * @param userid 
         * @description  enter the registered userid with the tenant
         * @param vtype
         * @description enter the verification type for user verification
         * @param postbackUrl
         * @description enter the callback url to receive the authentication status
         *  end point to get details of user and verify it
         */    

         api.post('/verify',function(req,res){
          var reqObject = {};
          reqObject.userId=req.body.userId;
          var vtype= verificationTypeObject[req.body.vtype] || verificationTypeObject["choice"];
          var finalCallBack = req.body.postbackUrl; 
          reqObject.vtype=vtype;
          reqObject.postbackUrl = finalCallBack;
          if(reqObject.postbackUrl && reqObject.vtype && reqObject.userId){
            var result = mainService.verify(reqObject,config,function(err,response){
              if(!err){
                console.log("From the controller repsone is ",response);
                res.send(response);              
              }else{
                res.send(err); 
              }
            });
          }else{
            res.send({status:400,message:"bad request make sure you pass userId, vtype and postbackUrl as content type 'application/x-www-form-urlencoded'"})
          }           
        });


         api.post('/handleResponse',function(req,res){
          console.log("Response from the callback received",req.body);

          eventEmitter.emit('message',req.body);
          console.log(util.inspect(req.body, {showHidden: false, depth: null}));
           // res.render('postbackhandler',req.body);
           res.end();
         });
         return api;
       }