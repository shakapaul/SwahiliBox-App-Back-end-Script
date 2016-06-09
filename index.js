////////// firefly_coder //////////////

//Initialize required node_modules.
var express = require('express');
var application = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var morgan = require('morgan');

//Connect to MongoDb.
mongoose.connect('mongodb://localhost/test');

//Craete a port to listen on.
var port = process.env.PORT || 3000;

//Initialize the required Middleware.
application.use(morgan('dev'));
application.use(express.static(path.join(__dirname, 'views')))
var urlencodedParser = bodyParser.urlencoded({'extended' : 'false'});

//Create a Schema model to hold your events data.
var Events = mongoose.model('Events', {
	title : String,
    venue : String,
    date : {type :Date,
            //requires JQuery Mobile UI for calendar!! I,m working on it.
            default: Date.now
          },
    time : String,
    rsvp : {type : Boolean,
        default : false}
});

//Index Home Page.
application.get('/', function(request, response){
    response.sendFile('index.html');
});

//Crud Page.
application.get('/crud', function(request, response){
    response.sendFile('crud.html', {'root' : 'views'});
});

//Return all the events from the schema.
application.get('/events', function(request, response){
	Events.find(function(error, events){
		if(error)
			response.send(error)
		response.json(events)
	});
});

//Insert events data into schema.
application.post('/events', urlencodedParser, function(request, response){
    Events.create({title : request.body.title,
                   venue : request.body.venue,
                   date : request.body.date,
                   time : request.body.time,
                   rsvp : request.body.rsvp
                 },
        function(error, events){
             if(error)
                response.send(error)
             Events.find(function(error, events){
                  if(error)
                    response.send(error)
                    response.json(events)
             });
        });
});

//Start the express HTTP Server.
application.listen(port, function(){
	console.log("The Magic Happens at port %s Hit Ctrl-c to Quit.", port);
});