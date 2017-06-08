
module.exports = function(app,config){
	// allows cross-origin request
	// app.use(function(req, res, next) {
	//   res.header("Access-Control-Allow-Origin", "*");
	//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,apikey");
	//   next();
	// });

	// app.use(function(req, res, next){ 
	// 	if(req.path == "/"){
	// 		next();
	// 		return;
	// 	}
	// 	if(req.headers['apikey'] && req.path != "/"){
	// 	  config.apikey = req.headers['apikey'];
	// 	  next();	
	// 	}else{
 //          res.send({error:true,message:'api key missing'});
	// 	}
	// });

};