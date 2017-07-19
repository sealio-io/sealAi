var express = require('express');
var mongo = require('mongodb');
var mongoose = require("mongoose");
var app = express();
var db = mongoose.connection;
var userJS = require("./user.js");
var User = require('./user');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var bodyParser = require('body-parser');
var cors = require('cors');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var url = 'mongodb://localhost:27017/sealDB';
// Imports
// var myModule = require('./js/voice-rec');
// var userName = myModule.userName;
// var trafficQuery = myModule.trafficQuery;
//connects to DB

//serve our static files
app.use(express.static(__dirname));
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));


mongoose.connect(url, function(err){
    if(err){
      console.log("error " + err);
  }else{
      console.log("mongoose connected");
  }

});

var collection;
MongoClient.connect(url, function(err, db) {
    if(err){
        console.log("Error connecting")
        process.close(1);
    }else{
        // Specifying collection. You can suse multiple connections.
        collection = db.collection('users');
        console.log("Connected correctly to mongo");
    }
});

var userList = [];

app.post('/home', jsonParser,function(req,res){

	var user = new User();
	user.name = req.body.name;
	user.traffic = req.body.traffic;
	user.date = req.body.date;
	//  console.log(req.body);
	user.save(function(err){
		
		if(err){
		console.log(err);
		}else{
		console.log(user);
		}

	});

});

app.get('/users',function(req,res){
	User.find({})
	.exec(function(err,users){

		if(err){
			res.send('error has occured');
		}else{
			res.json(users);
			console.log(users)
		}

	});
})

// app.get('/users', function(req,response){
//     User.find({}, { name: true }, function(err, users) {
//         response.json(users);
//     });
// });

//Schema
// var userSchema = new mongoose.Schema({
//   name: String,
//   trafficQuery: String,
//   date: Number
// });

// Middle Ware

//Sets port
var port = 8080;
app.listen(port, () => console.log("listening on  " + port));
// var User = mongoose.model("User", userSchema);

