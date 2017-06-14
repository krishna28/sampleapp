var express = require('express'); 

var bodyParser =  require('body-parser'); // used to handle request parameter

var morgan = require('morgan'); // package used for logging

var partials = require('express-partials'); // used for layout

var routes = require('./app/routes');

var config = require("./config/" + (process.env.NODE_ENV || "development") + ".js"); // config file

var base64 = require('base-64');
var utf8 = require('utf8');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var helmet = require('helmet')
app.use(helmet());

var events = require('events');
var eventEmitter = new events.EventEmitter();
app.use(partials());
app.set('view options', {defaultLayout: 'layout'});
var crossOrigin = require('./app/middlewares/crossOrigin');
var middleware = require('./app/middlewares/middleware')(app,config);
var errorHandler = require('./app/middlewares/errorHandler');
//error handler
app.use(errorHandler.error);


//reading client details

if(process.env.clientId && process.env.clientSecret){
	const finalString = process.env.clientId.toString().concat(":").concat(process.env.clientSecret.toString());
	var bytes = utf8.encode(finalString);
	var encodedString = base64.encode(bytes);
	console.log("The encoded string is ",encodedString)
	config.authorization_key = encodedString;
}

app.set('view engine', 'ejs');
// allows form parameter binding to req object and extended true basically allows you to parse full objects 
app.use(bodyParser.urlencoded({extended:true}));
// allows to handle json request parameter
app.use(bodyParser.json());
// used for logging
app.use(morgan('dev'));
app.get('/', routes.index);
app.get('/postbackhandler', routes.postbackhandler);
app.get('/', routes.error);
app.use(express.static(__dirname + '/public')); // serves static file from public folder
var api = require('./app/routes/mainController')(app,express,eventEmitter,config);

app.use('/api', api); // end point will be accessed by appending api to the end point


io.on('connection', function(socket){
	console.log('a user connected');
	eventEmitter.on('message',function(data){
		console.log("Yes event received inside the connection", data);
		socket.emit('statusReceived', data);
	});
});

io.on('disconnect', function () {
    console.log('DISCONNESSO!!!');
});

http.listen(config.port, function(err){
	if(err){
		console.log("error");
	}else{
		console.log("server listening on port"+config.port);   
	}

});


