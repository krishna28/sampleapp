var express = require('express'); 

var bodyParser =  require('body-parser'); // used to handle request parameter

var morgan = require('morgan'); // package used for logging

var config = require('./config'); // config file

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var events = require('events');
var eventEmitter = new events.EventEmitter();

var middleware = require('./app/routes/middleware')(app,config);



// allows form parameter binding to req object and extended true basically allows you to parse full objects 
app.use(bodyParser.urlencoded({extended:true}));
// allows to handle json request parameter
app.use(bodyParser.json());
// used for logging
app.use(morgan('dev'));

app.use(express.static(__dirname + '/public')); // serves static file from public folder



var api = require('./app/routes/service')(app,express,eventEmitter);

app.use('/api', api); // end point will be accessed by appending api to the end point
  eventEmitter.on('message',function(data){
   console.log("Yes event received ouside", data);
  });

io.on('connection', function(socket){
  console.log('a user connected');
  eventEmitter.on('message',function(data){
   console.log("Yes event received inside ", data);
   socket.emit('statusReceived', data);
  });
  // var data;
  // var res = data || {"name":"krishna"};
  socket.emit('verifiedStatus', {"name":"krishna"});
});

http.listen(config.port, function(err){
  if(err){
    console.log("error");
  }else{
    console.log("server listening on port"+config.port);   
  }

});


// app.listen(config.port,function(err){

//   if(err){
//     console.log("error");
//   }else{
//     console.log("server listening on port"+config.port);   
//   }

// });

