var app = angular.module('timeLine',[]);

//support location service
app.config(function($locationProvider) {
    $locationProvider.html5Mode(true); 
});
var uuid;
var day;
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
    //init the date on the time line
    //the first login to time line page
    if(day == undefined){
    	console.log("day = undefined");
    	currentDay = d.toDateString();
    	console.log("currentDay: "+ currentDay );
    }
    else if(dayName == day){
    	console.log("day choosen equ to real date");
    	currentDay = d.toDateString();
    }
    //if the real date bigger than choosen date
    else if(dateArray[dayName]  > dateArray[day]){
    	console.log("the real date bigger than choosen date");
    	var reduceDay = dateArray[dayName] - dateArray[day];
    	
    	var previousDay = new Date(d);
    	previousDay.setDate(d.getDate()-reduceDay);
    	currentDay = previousDay.toDateString();
    }
    //if the real date smaller than choosen date 
    else if(dateArray[dayName] < dateArray[day]){
    	console.log("the real date smaller than choosen date");
    	var addDay = dateArray[day] - dateArray[dayName];
    	
    	var nextDay = new Date(d);
    	nextDay.setDate(d.getDate()+addDay);
    	currentDay = nextDay .toDateString();
    }
    //get time line horoscope by spcify day
    if(day){
        console.log(day);
        $http.get("https://estreja.herokuapp.com/ws_horoscope/getTimeLineHoroByDay/"+uuid+"/"+day).success(function(data){
            console.log(data);
            model.items = data;
        });

    }
    else{
        console.log(day + "no");
        $http.get("https://estreja.herokuapp.com/ws_horoscope/getTimeLineHoroscope/"+uuid).success(function(data){
            console.log(data);
            model.items = data;
        });
    }

    $http.get("https://estreja.herokuapp.com/ws_horoscope/getMatcherData/"+uuid).success(function(data){
        console.log(data);
        model.matcher = data;
    });
	
});


app.controller('timeLine', function ($scope) {
    $scope.horoscopes = model;
    $scope.myUrl = uuid;  
	$scope.date = currentDay;
	$scope.day = day;
});

app.controller('matcherByHoro', function ($scope) {
        $scope.matcherHoro = model;
        $scope.myUrl = uuid;
});

app.controller('matcherByName', function ($scope) {
        $scope.matcherName = model;
        $scope.myUrl = uuid;
});

app.controller('header', function ($scope) {
        $scope.header = model;
        $scope.myUrl = uuid;
});

app.controller('zodiacLogo', function ($scope) {
        $scope.zodiac = model;
        $scope.myUrl = uuid;
});

app.controller('hamburger', function ($scope) {
        $scope.zodiac = model;
        $scope.myUrl = uuid;
});

//Capitalize the first letter of string
app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});



