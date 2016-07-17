var app = angular.module('fullHoroScopeApp',[]);

app.config(function($locationProvider) {

    $locationProvider.html5Mode(true); 

});

var horoscopeDay;
var uuid;
var model = {
};

var dateArray = {sunday:1, monday:2,thesday:3,wednesday:4,thursday:5,friday:6,saturday:7};
var d = new Date();
var weekday = new Array(7);
weekday[0]=  "sunday";
weekday[1] = "monday";
weekday[2] = "thesday";
weekday[3] = "wednesday";
weekday[4] = "thursday";
weekday[5] = "friday";
weekday[6] = "saturday";

var dayName = weekday[d.getDay()];
console.log("dayName " + dayName );
var currentDay;


app.run(function($location,$http) {

    day = $location.search()['day'];
    //uuid user's
    uuid = $location.search()['uuid'];

    //init the date on the horoscope page
    //the first login to time line page
    if(day == ""){
    	console.log("day = undefined");
    	currentDay = d.toDateString();
    	console.log("currentDay: "+ currentDay );
    }
    else if(dayName == day){
    	console.log("day choosen equ to real date");
    	currentDay = d.toDateString();
    }
    //if the real date bigger than chosen date
    else if(dateArray[dayName]  > dateArray[day]){
    	console.log("the real date bigger than choosen date");
    	var reduceDay = dateArray[dayName] - dateArray[day];
    	
    	var previousDay = new Date(d);
    	previousDay.setDate(d.getDate()-reduceDay);
    	currentDay = previousDay.toDateString();
    }
    //if the real date smaller than chosen date 
    else if(dateArray[dayName] < dateArray[day]){
    	console.log("the real date smaller than choosen date");
    	var addDay = dateArray[day] - dateArray[dayName];
    	
    	var nextDay = new Date(d);
    	nextDay.setDate(d.getDate()+addDay);
    	currentDay = nextDay .toDateString();
    }
    if(day == ""){
 	  horoscopeDay = dayName;
    }
    else{
	   horoscopeDay = day;
    }
    console.log(horoscopeDay + " horoscopeDay");
    $http.get("https://estreja.herokuapp.com/ws_horoscope/getFullHoroscope/"+uuid+"/"+horoscopeDay).success(function(data){
         console.log(data);
         model.user = data;
    });
});


app.controller('fullHoroscope',function ($scope) {
    $scope.details = model
    $scope.myUrl = uuid
    $scope.date = currentDay;
    $scope.jsFunction = function() {
        seeMore();
    }

});


//Capitalize the first letter of string
app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});