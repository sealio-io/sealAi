var myApp = angular.module('myApp',['ui.router']);

myApp.config(function($stateProvider,$urlRouterProvider) {
	$urlRouterProvider.otherwise('/home');
	$stateProvider.state('home', {
		url: "/home",
		templateUrl: './templates/home.html'
	})

	$stateProvider.state('trafficHistory',{
		url:'/trafficHistory',
		templateUrl:'../templates/trafficHistory.html'
	})

});

//Global Vars
var aiListen = true;
var nameStage = false;
// Creates Date
var date = new Date();
var month = date.getMonth() + 1;
var year = date.getFullYear();
var day = date.getDate();
var userDate = month+"-"+day+"-"+year;

//Creates Time
var hour = date.getHours();
var meridian;

if(hour <= 12){
	meridian = "AM";
}else{
	meridian = "PM";
	hour = hour-12;
	if(hour == 0){
		hour = hour + 1;
	}
}

var minutes = date.getMinutes();
if (minutes<10){
	minutes = "0" + minutes;
}

var userTime = hour+":"+minutes+" "+meridian;
console.log(userTime);
var duckActivate = false;
var userName;
myApp.controller('voiceRec', ['$scope','$http','$rootScope', function($scope, $http,$rootScope) {

//Recog JS
var accessToken = "f68b9ecf076c424698d53089f90413ff";
var baseUrl = "https://api.api.ai/v1/";
var respText;
$(document).ready(function() {
	
	var recButton = document.getElementById('rec');
	var pentSec;
	pentSec++;
	displayGo = false;
	//var homeButton = document.getElementById('homeButton');
	// homeButton.onclick = function(){
	// 	aiListen = true;
	// }
	setInterval(function(){
		switchRecognition();
	}, 1000);

	var recognition;
	var userInput;
	function startRecognition() {

		recognition = new webkitSpeechRecognition();
	//Listening (capturing voice from audio input) started.
    //This is a good place to give the user visual feedback about that (i.e. flash a red light, etc.)
    recognition.onstart = function(event) {
    	updateRec();
    };
    var text = "";
	//the event holds the results
	recognition.onresult = function(event) {
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			text += event.results[i][0].transcript;
			if (text === "Hey Duck"){
				console.log("CHECK");
				//duckActivate = true;
				//console.log("duckactivate = "+duckActivate);
			}

		}

	    // MAYBE HERE IS WHERE U WANT TO CHECK THE VARIABLE TEXT TO MATCH
	    // A PARTICULAR STATE. DEPENDING ON WHAT THAT STATE IS, U CAN USE THE PROPER
	    // SET INPUT WHICH WOULD CALL ITS OWN SEND FUNCTION TO THE API, U SHOULD
	    // ALSO MAKE DIFFERENT TEXT VARIABLES FOR POSSIBLE STRINGS LIKE HEY DUCK,
	    // NAME, ENTERING/LEAVING, SO U CAN CALL THE PROPER CUSTOM METHODS. U WOULD
	    // HAVE TO LOOP THROUGH THIS FUNCTION UNTIL U GET A PROPER RESPONSE. BUT 
	    // PRIORITY IS DETECTING HEY DUCK IN THE BEGINNING. 
	    var initDuck1 = text.includes("Hey Duck");
	    var initDuck2 = text.includes("hey duck");
	    var initDuck4 = text.includes("heyduck");
	    var initDuck5 = text.includes("hajduck");
	    var initDuck9 = text.includes("hey Doc");
	    var initDuck11 = text.includes("hey dukh");

	    if (initDuck1 == true){
	    	console.log("text = "+text);
	    	duckActivate = true;
	    	console.log("duckactivate = "+duckActivate);
	    }else if (initDuck2 == true){
	    	console.log("text = "+text);
	    	duckActivate = true;
	    	console.log("duckactivate = "+duckActivate);
	    }else if (initDuck4 == true){
	    	console.log("text = "+text);
	    	duckActivate = true;
	    	console.log("duckactivate = "+duckActivate);
	    }else if (initDuck5 == true){
	    	console.log("text = "+text);
	    	duckActivate = true;
	    	console.log("duckactivate = "+duckActivate);
	    }else if(initDuck9 == true){
	    	console.log("text = "+text);
	    	duckActivate = true;
	    	console.log("duckactivate = "+duckActivate);	
	    }else if(initDuck11 == true){
	    	console.log("text = "+text);
	    	duckActivate = true;
	    	console.log("duckactivate = "+duckActivate);	    	
	    }

	    //ai picks up own voice <- this stops that from happening
	    // var aiPickEL = "hey "+userName+" are you entering or leaving";
	    // if(text === aiPickEL){
	    // 	text = "aejknrfirneuiaebfiuoavbeoriyeawvoifvieuafeiuvfiaeupfveugfuoeagfpuaigfourghourehgouragourahg";
	    // }

	    setInput(text);
	    userInput = text;

	    console.log(text);

	    // parseName();
		//stopRecognition();
	};

	recognition.onend = function() {
		stopRecognition();
	};
	recognition.lang = "en-US";
	recognition.start();
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
		//stopRecognition();
	} else {
		console.log('Speak Now');
		startRecognition();
	}
}

function setInput(text) {
	// if text == hey duck then run the send function
	
	$("#input").val(text);

	// if (duckActivate)
	if (duckActivate == true){
		send();
	}

}

 
function updateRec() {
	$("#rec").text(recognition ? "Stop" : "Speak");
}


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
			//sets delay for name query
			if(respText === "Hello, what's your name?"){
				stopRecognition();

			}
			//sets value too cancels the "SPEAK NOW" interval
			if (duckActivate == true){
				if(respText === "thank you"){
					duckActivate = false;
					console.log("duckActivate = "+duckActivate);
				}
			}
			setResponse(respText);
			var duckResponse = new SpeechSynthesisUtterance(respText);
			duckResponse.lang='en-GR';
			window.speechSynthesis.speak(duckResponse);
			console.log("user input =",userInput);
			//Pop Name
			// var userIntro = "name is" || "i am";
			// var name = userName.split(userIntro).pop();
			// console.log("name var =" ,name);
			//Pop leave or entering
			
			var userLeaving = userInput.includes("leaving");
			var userEntering = userInput.includes("entering");
			var duckTrafficQuery = userInput.includes("entering or leaving");
			var answeringQuery = userInput.includes("answering");
			var trafficQuery;
			var trafficQueryFinal;
			
			if (userInput.includes("I'm entering")){
				trafficQueryFinal = "entering";
			}
			else if (userInput.includes("I'm leaving")){
				trafficQueryFinal = "leaving";
			}
			else if(userInput.includes("entering or leaving")){
				trafficQueryFinal = "entering or leaving";
			}
			else if(userInput === "I am answering"){
				trafficQueryFinal = "entering";
			}
			else if(userInput === "you entering or leaving entering"){
				trafficQueryFinal = "entering";
			}
			else if(userInput === "you entering or leaving leaving"){
				trafficQueryFinal = "leaving";
			}
			else if(userInput === "are you entering or leaving entering"){
				trafficQueryFinal = "entering";
			}
			else if (userInput === "are you entering or leaving leaving"){
				trafficQueryFinal = "leaving";
			}
			else if(answeringQuery == true){
				trafficQueryFinal = "entering";
			}
			else if(duckTrafficQuery == true){
				trafficQueryFinal = "entering or leaving";
			}
			else if(userInput === "you entering or leaving"){
				trafficQueryFinal = "you entering or leaving";
			}
			else if(userLeaving == true){
				trafficQueryFinal = "leaving"
				// trafficQuery = "leaving";
				// aiListen = false;
			}else if(userEntering == true){
				trafficQueryFinal = "entering";
				// trafficQuery = "entering";
				// aiListen = false;xw
			}else if (userInput.includes("are you entering or leaving")){
				console.log("userInput includes are you entering or leaving")
				trafficQueryFinal = "are you entering or leaving?"
			}

			switch(trafficQueryFinal){
				case "are you entering or leaving?":

				case "entering or leaving":

				case "you entering or leaving":

				case "leaving":
				trafficQuery = "leaving";
				aiListen = false;
				break;

				case "entering":
				trafficQuery = "entering";
				aiListen = false;
				break;

				default:
				console.log("NO CASE FOUND")

			}

			console.log("trafficQuery",trafficQuery);

			if(respText==="thank you"){
				var nameLog =document.getElementById('nameLog');
				var trafficLog =document.getElementById('trafficLog');
				var dateLog = document.getElementById('dateLog');
				var timeLog = document.getElementById('timeLog');
				dateLog.value = userDate;
				nameLog.value = userName;
				trafficLog.value = trafficQuery;
				timeLog.value = userTime;

				var userLog = {
					"name":userName,
					"traffic":trafficQuery,
					"date":userDate,
					"time":userTime
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

// Init Conversation

});
// Listens 24/7

}]);

myApp.controller('trafficHistory', ['$scope','$http','$rootScope', function($scope, $http,$rootScope){

	var homeButton = document.getElementById('homeButton');

	homeButton.onclick = function(){
		aiListen = true;
		alert('aiListen = ' + aiListen);
	}

	$http.get('/users').then(function(data) {
		$scope.users = data.data;
	})

}]);

