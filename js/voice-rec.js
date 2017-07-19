var myApp = angular.module('myApp',['ui.router']);

myApp.config(function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
 	$stateProvider.state('home', {
        url: "/home",
        templateUrl: './templates/home.html'
    })

});

var date = new Date();
var month = date.getMonth() + 1;
var year = date.getFullYear();
var day = date.getDate();
var userDate = month+"-"+day+"-"+year;

myApp.controller('voiceRec', ['$scope','$http', function($scope, $http) {


//Recog JS
var accessToken = "b246508062dc444f8699e0a18046b639";
var baseUrl = "https://api.api.ai/v1/";

$(document).ready(function() {

	var recButton = document.getElementById('rec');
	var pentSec;
	pentSec++;
	displayGo = false;

	setInterval(function(){

		switchRecognition();
		console.log(pentSec + 5, "- seconds");


	}, 7000);

var recognition;
var userInput;
function startRecognition() {
	//recognition = new webkitSpeechRecognition();
	recognition = new webkitSpeechRecognition();
	recognition.onstart = function(event) {
		updateRec();
	};
	recognition.onresult = function(event) {
		var text = "";
	    for (var i = event.resultIndex; i < event.results.length; ++i) {
	    	text += event.results[i][0].transcript;
	    }
	    setInput(text);
	    userInput = text;

	    console.log(text);

	    // parseName();
		stopRecognition();
	};

	recognition.onend = function() {
		stopRecognition();
	};
	recognition.lang = "en-US";
	recognition.start();
}


//Parses user's name
function parseName(){

}

function stopRecognition() {
	if (recognition) {
		recognition.stop();
		recognition = null;
	}
	updateRec();
}

function switchRecognition() {
	if (recognition) {
		console.log("listening");
		stopRecognition();
	} else {
		console.log('Speak Now');
		startRecognition();
	}
}

function setInput(text) {
	$("#input").val(text);
	send();
}

function updateRec() {
	$("#rec").text(recognition ? "Stop" : "Speak");
}
var userName ;
function send() {
	var text = $("#input").val();
	$.ajax({
		type: "POST",
		url: baseUrl + "query?v=20150910",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		headers: {
			"Authorization": "Bearer " + accessToken
		},
		data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
		success: function(data) {
			console.log(data.result);
			var respText = data.result.fulfillment.speech;
			if (data.result.parameters.name !== null){
			 userName = data.result.parameters.name;
			}	
			console.log("username =",userName);
			console.log(respText);
			setResponse(respText);
			var userResponse = new SpeechSynthesisUtterance(respText);
			window.speechSynthesis.speak(userResponse);
			console.log("user input =",userInput);
			//Pop Name
			// var userIntro = "name is" || "i am";
			// var name = userName.split(userIntro).pop();
			// console.log("name var =" ,name);
			//Pop leave or entering
			var trafficQuery;
			if(userInput === "leaving"){

				trafficQuery = "leaving"


			}else if(userInput === "entering"){

				trafficQuery = "entering"

			}

			console.log("trafficQuery",trafficQuery);


			if(respText==="thank you"){
				var nameLog =document.getElementById('nameLog');
				var trafficLog =document.getElementById('trafficLog');
				var dateLog = document.getElementById('dateLog');
				dateLog.value = userDate;
				nameLog.value = userName;
				trafficLog.value = trafficQuery;

				var userLog = {
					"name":userName,
					"trafficQuery":trafficQuery,
					"time":userDate
				}

				console.log(userLog);
				$http.post('/home',userLog);

		    }
		},
		error: function() {
			setResponse("Internal Server Error");
		}
	});
	setResponse("Thinking...");
}

function setResponse(val) {
	$("#response").text(val);
}
});

}]);

