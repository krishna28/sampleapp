
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
         * @name verify
         * @description end point to verify the user details
         * @param userid
         * @param verification type
         *  end point to get details of user and verify it
         */    

         api.post('/verify',function(req,res){

          var reqObject = {};
          reqObject.userId=req.body.userId;
          var vtype= verificationTypeObject[req.body.vtype] || verificationTypeObject["choice"];
          reqObject.vtype=vtype;
          var result = mainService.verify(reqObject,config,function(err,response){
            if(!err){
              console.log("From the controller repsone is ",response.messageId);
              res.send(response.messageId);
              eventEmitter.on('message',function(data){
                console.log("Event received ",data);
                res.send(data);
              });                 
            }
          });           
        });


         api.post('/handleResponse',function(req,res){
          console.log("Response from the callback received",req.body);
           eventEmitter.emit('message',req.body);
           console.log(util.inspect(req.body, {showHidden: false, depth: null}));
           // res.send({"message":"hello"});
         });
         return api;

       }