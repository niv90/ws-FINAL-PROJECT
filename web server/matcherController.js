var mongoose = require('mongoose');
var Horoscope = require('./horoscope');
var User = require('./user');
//Assign each letter a digit from 1 to 9
var alphabet = {A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
                J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
                S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8};                                  


//getTop3ByName variable
var rootUserFlag = 0;
var matcherArray = [];
var indexUserDigit;
var copy = [];
var rightIndex;
var leftIndex;
var addCount = 3;
var checkEndArray = 0;
var checkStartArray = 0;

//getTop3ByHoro variable
var artArray= [];
var travelArray= [];
var natureArray= [];
var copyArt = [];
var copyTravel = [];
var copyNature = [];
var resultByHoro = [];
var addHoroCount = 0;


exports.getMatchData = function(req,res){
    console.log("inside getMatchData function in mathcer module");
    rootUserFlag = 0;
    matcherArray = [];
    copy = [];
    checkEndArray = 0;
    checkStartArray = 0;
    artArray= [];
    travelArray= [];
    natureArray= [];
    copyArt = [];
    copyTravel = [];
    copyNature = [];
    resultByHoro = [];
    addCount = 3;
    addHoroCount = 0;

    //define uniqe id for system user
    var id = 1;
    var userSystemImage;
    var userSystemZodiac;

    User.find({}).where("_id").equals(req.params.id).
    exec(function(err,result){
        if (err) return next(err);
        console.log("result.gender: " + result[0].gender);
        
        userSystemImage = result[0].imageUrl;
        userSystemZodiac = result[0].zodiac;
        var user = result[0].name.toUpperCase();
        var lastName = result[0].lastName.toUpperCase();
        console.log("inside user system query" +"name: " + user + "last: " + lastName +  "id: " + id);
        
        //Match each letter in name to its corresponding number and adding together numbers 
        convertNameToNumber(id,user,lastName);

        //filter by user system gender and id 
        User.find({ gender: { $ne: result[0].gender}, _id : { $ne: result[0]._id} }).
            exec(function(err,docs){
            for(index=0; index < docs.length; index++ ){
                console.log("get all ne my gender-1111111111111111111: " + docs);
                var user = docs[index].name.toUpperCase();
                var lastName = docs[index].lastName.toUpperCase();
                convertNameToNumber(docs[index].id,user,lastName,docs[index].imageUrl);
            }

            //sorting the array by single Digit
            matcherArray.sort(function(a, b) {
                return parseFloat(a.singleDigit) - parseFloat(b.singleDigit);
            });
            console.log(matcherArray);
            //find the index of the user system

	    console.log("before before function - niv");
	    
	     
		
		var f;
		var filteredElements = matcherArray.filter(function(item, index) { 
			f = index, console.log("f: " + f); 
			if(item.id == "1"){
				console.log("item.id == 1: " + f)
				indexUserDigit = f;
					
			}
		});

        //indexUserDigit = matcherArray.findIndex(function(x) {x.id==1; });
	    console.log("before after function - niv");

            rightIndex = indexUserDigit+1;
            leftIndex = indexUserDigit-1;

            //get top 3 matcher users by name
            top3ResultByName = getTop3(indexUserDigit);

            //get top 3 by horoscope
            getMatchByHoro(req.params.id,result[0].gender,function(data){
	    
                res.json({byName:top3ResultByName,ByHoro:data,userSystemImage:userSystemImage,userSystemZodiac:userSystemZodiac});
            });
            return;
       
	
	//res.json({byName:[matcherArray[0],matcherArray[1],matcherArray[2]],ByHoro:[matcherArray[0],matcherArray[2],matcherArray[1]],userSystemImage:userSystemImage,userSystemZodiac:userSystemZodiac});
        });
        return;
    });
}

convertNameToNumber = function(id,name,lastName,image){
    
    var userName
    userName = name+lastName;
    //total number after converting the full name
    var totalNumber = 0;
    console.log("upper case name in function: " +  id + " user name: " + userName + " Image: " + image);
    //convert each number in the name to number and sum it
    for (Count=0; Count < userName.length ; Count++) {

        letter=userName.substring(Count,Count+1);
        console.log("letter: " + letter);
        console.log("alphabet.leteer:" + alphabet[letter]);
        //skip on space
        if(!alphabet[letter] == " ")
            totalNumber += alphabet[letter];
    }
    console.log("totalNumber: " + totalNumber);
    //Reduce the sum of name’s numbers into a single digit
    //exract right digit via modulus
    var rightDigit = totalNumber%10;
    //exractd left digit via division 
    var leftDigit = totalNumber/10;
    var singleDigit = Math.floor(rightDigit+leftDigit);
    //check if singleDigit have a single digit
    var oneDigit = isDigit(singleDigit);

    if(!oneDigit){
        rightDigit = singleDigit%10;
        leftDigit = singleDigit/10;
        singleDigit = Math.floor(rightDigit+leftDigit);
    }

    //define the singleDigit of the root user
    if(rootUserFlag == 0){
        var userSingleDigit = singleDigit;
        rootUserFlag++;
        console.log(singleDigit);
        matcherArray.push({id:id,singleDigit:userSingleDigit});
        return;
    }
    console.log(singleDigit);
    matcherArray.push({id:id,singleDigit:singleDigit,imageUrl:image,name:name.toLowerCase()});
}

//check if the number contain only one digit
function isDigit(val) {
  return String(+val).charAt(0) == val;
}

//get top 3 by name
getTop3 = function(index){

    while(addCount != 0){

        console.log("inside while top3 rightIndex: " + rightIndex);
        console.log("inside while top3 leftIndex: " + leftIndex);
        console.log("checkEndArray: " + checkEndArray);
        //if the index isn't in the end of the array
        if(checkEndArray == 0){
             console.log("inside checkEndArray: " + checkEndArray);
             //the singleDigit of user system equal to the singleDigit of another user
            if(matcherArray[index].singleDigit == matcherArray[rightIndex].singleDigit){
                console.log("index + right equal");
                matcherArray[rightIndex].match = '100';
                copy.push(matcherArray[rightIndex]);
                //check array bound
                if(rightIndex == (matcherArray.length-1)){
                    checkEndArray=1;
                }
                if(rightIndex != (matcherArray.length-1)){ 
                    rightIndex++;
                }
                addCount -= 1;
                console.log("addCount: " + addCount);
            }
            else{
               //the rightIndex is in the middle of the array
               indexInMiddle(index); 
            }
        }
        //if the index is in the end of the array
        else if(checkEndArray == 1){
            console.log("inside checkEndArray: " + checkEndArray);
            console.log("right == end - rightIndex: " + rightIndex  + " matcherArray.length-1: " + (matcherArray.length-1));
            //run to the left side from the user system index
            for(var i = 0 ; i < addCount ; i++){
                var result = matcherArray[index].singleDigit - matcherArray[leftIndex].singleDigit;
                matcherArray[leftIndex].match = (100 - (result * 5));
                copy.push(matcherArray[leftIndex]);
                //check array bound
                if(leftIndex != 0){ 
                    leftIndex--;
                }
                addCount -= 1;
                console.log("addCount: " + addCount);
            }
        }
        //if the index isn't in the start of the array
        else if(checkStartArray == 0){
            //the singleDigit of user system equal to the singleDigit of another user
            if(matcherArray[index].singleDigit == matcherArray[leftIndex].singleDigit){
                console.log("index + left equal");
                matcherArray[leftIndex].match = '100';
                copy.push(matcherArray[leftIndex]);
                //check array bound
                if(leftIndex == 0){
                    checkStartArray=1;
                }
                if(leftIndex != 0){ 
                    leftIndex--;
                }
                addCount -= 1;
                console.log("addCount: " + addCount);
            }
            else{
               //the leftIndex is in the middle of the array
               indexInMiddle(index); 
            }
        }
        else{
            //if the index is in the start of the array
            console.log("left == 0 ");
            //run to the right side from the user system index
            for(var i = 0 ; i < addCount ; i++){
                var result = matcherArray[rightIndex].singleDigit - matcherArray[index].singleDigit;
                matcherArray[rightIndex].match = (100 - (result * 5));
                copy.push(matcherArray[rightIndex]);
                //check array bound
                if(rightIndex != (matcherArray.length-1)){ 
                    rightIndex++;
                }
                addCount -= 1;
                console.log("addCount: " + addCount);
            }
        } 
    }
    return copy
}
//the pivot index of the user system is in the array middle
indexInMiddle = function(index){

    console.log("in the middle of the array root index: " + index);
    var rightResult = matcherArray[rightIndex].singleDigit - matcherArray[index].singleDigit;
    var leftResult = matcherArray[index].singleDigit - matcherArray[leftIndex].singleDigit;
    //check if the single digit in the right index bigger from the left index 
    if(leftResult < rightResult){
        matcherArray[leftIndex].match = (100 - (leftResult * 5));
        copy.push(matcherArray[leftIndex]);
        //check array bound
        if(leftIndex == 0){
            checkStartArray=1;
        }
        if(leftIndex != 0){ 
            leftIndex--;
        }
        addCount -= 1;
        console.log("addCount: " + addCount); 
    }
    //check if the single digit in the left index bigger from the left index 
    else if(leftResult > rightResult){
        matcherArray[rightIndex].match = (100 - (leftResult * 5));
        copy.push(matcherArray[rightIndex]);
        //check array bound
        if(rightIndex == (matcherArray.length-1)){
            checkEndArray=1;
        }
        if(rightIndex != (matcherArray.length-1)){ 
            rightIndex++;
         }
        addCount -= 1;
        console.log("addCount: " + addCount); 
    }
    else{
        matcherArray[rightIndex].match = (100 - (leftResult * 5));
        copy.push(matcherArray[rightIndex]);
        //check array bound
        if(rightIndex == (matcherArray.length-1)){
            checkEndArray=1;
        }
        if(rightIndex != (matcherArray.length-1)){ 
            rightIndex++;
         }
        addCount -= 1;
        console.log("addCount: " + addCount); 
    }  
}

//get top3 by horoscope
getMatchByHoro = function(id,gender,callback){
    console.log("inside getMatchByHoro function in mathcer module id: "  + id + "gender: " + gender);

    getUserDetails(id,function(data){

        //get the details of user syste
        console.log(data);
        var userId = 1;
        artArray.push({id:userId,art:data[0].art});
        natureArray.push({id:userId,nature:data[0].nature});
        travelArray.push({id:userId,travel:data[0].travel});
        //get the details of all users
        User.find({ gender: { $ne: gender}, _id : { $ne: id} }).
         exec(function(err,docs){
            console.log("by horo ne my gender: " + docs );
            if (err) return next(err);
                for(index=0; index < docs.length; index++ ){
                    artArray.push({id:docs[index].id,category:docs[index].art,zodiac:docs[index].zodiac,imageUrl:docs[index].imageUrl});
                    natureArray.push({id:docs[index].id,category:docs[index].nature,zodiac:docs[index].zodiac,imageUrl:docs[index].imageUrl});
                    travelArray.push({id:docs[index].id,category:docs[index].travel,zodiac:docs[index].zodiac,imageUrl:docs[index].imageUrl});
                }
            //sort the array by art/travel/nature
            artArray.sort(function(a, b) {
                return parseFloat(a.category) - parseFloat(b.category);
            });
            natureArray.sort(function(a, b) {
                return parseFloat(a.category) - parseFloat(b.category);
            });
            travelArray.sort(function(a, b) {
                return parseFloat(a.category) - parseFloat(b.category);
            });

	    var indexhoro;
		var filteredElements = artArray.filter(function(item, index) { 
			indexhoro = index, console.log("indexhoro: " + indexhoro); 
			if(item.id == "1"){
				console.log("item.id == 1: " + indexhoro)
				indexUserHoro = indexhoro;
					
			}
	    });

            //find the pivot index of the user
            //indexUserHoro = artArray.findIndex(function(x) {x.id==1; });
            copyArt = getTop3ByHoro(indexUserHoro,artArray);
            console.log(copyArt);


	   var filteredElements = natureArray.filter(function(item, index) { 
			indexhoro = index, console.log("indexhoro: " + indexhoro); 
			if(item.id == "1"){
				console.log("item.id == 1: " + indexhoro)
				indexUserHoro = indexhoro;
					
			}
	    });

            //indexUserHoro = natureArray.findIndex(function(x) {x.id==1; });
            copyTravel =  getTop3ByHoro(indexUserHoro,natureArray);
            console.log(copyTravel);

	     var filteredElements = travelArray.filter(function(item, index) { 
			indexhoro = index, console.log("indexhoro: " + indexhoro); 
			if(item.id == "1"){
				console.log("item.id == 1: " + indexhoro)
				indexUserHoro = indexhoro;
					
			}
	    });

            //indexUserHoro = travelArray.findIndex(function(x) {x.id==1; });
            copyNature =  getTop3ByHoro(indexUserHoro,travelArray);
            console.log(copyNature);

            //check if user system object exist if exist remove it from array
            removeUserObject(copyArt);
            removeUserObject(copyTravel);
            removeUserObject(copyNature);
            console.log("agterrrrrrrrrrrrr slice");
            console.log(copyArt);
            console.log(copyTravel);
            console.log(copyNature);
            //check if there is the same object in the arrays and get the top 3 matcher
            compareArray(copyArt,copyTravel);
            compareArray(copyArt,copyNature);
            compareArray(copyTravel,copyNature);
            console.log("resultByHorooooooooooooooooooo");
            console.log(resultByHoro);
            //if we not receive all top 3 we add it from arrays
            if(addHoroCount != 3){
                addMatcher(copyTravel,resultByHoro);
                addMatcher(copyNature,resultByHoro);
                addMatcher(copyArt,resultByHoro);
            }
            return callback(resultByHoro);
         });
    });

    return;
}
//if we not receive all top 3 we add it from arrays
addMatcher = function(array1,resultArray){
    console.log("inside add mathcer");
    res = containsObject(array1[i], resultArray)
    if(res == false){
        array1[i].match = 50;
        console.log("resultByHoro.push" + array1[i]);
        resultByHoro.push(array1[i]);
        addHoroCount += 1;
    }
}
//check if there is the same object in the arrays and push them to result array
compareArray = function(array1,array2){
    var average = 0;
    for (var i = 0; i < array1.length; i++) { 
        for (var j = 0; j < array2.length; j++) { 
            if (array1[i].id == array2[j].id) {

                console.log("outside check-addHoroCount = "+ addHoroCount);
                if(addHoroCount != 3){
                    average = 0;
                    average += (((array1[i].category + array2[j].category)/200)*100);
                    array1[i].match = Math.floor(average);

                    res = containsObject(array1[i], resultByHoro);
                    if(res == false){
                        console.log("insdie false" + addHoroCount); 
                        console.log("resultByHoro.push" + array1[i]); 
                        resultByHoro.push(array1[i]);
                        addHoroCount += 1;
                    }
                }
            }
        }
    } 
}

function containsObject(obj, list) {
    console.log("inside containsObject");
    var i;
    if(list.length == 0){
        console.log("list.length == 0");
        console.log("obj.id: " + obj.id);
        console.log("resultByHoro.push" + obj);
        resultByHoro.push(obj);
        addHoroCount += 1;
        return true;
    }
    for (i = 0; i < list.length; i++) {
        console.log("list[i].id, obj.id: " + list[i].id + " " + obj.id); 
        if (list[i].id == obj.id) {
            return true;
        }
    }
    return false;
}
//remove user system object from the array
removeUserObject = function(array){
    for(var i=0 ; i < array.length ; i++){
       if(array[i].id == 1){
            array.splice(i,1);
        }
    }
}
//slice the array by 4 closest indexs
getTop3ByHoro = function(indexUser,array){
    console.log("inside getTop3ByHoro");
    console.log("indexUser: " + indexUser + " array length: " + array.length);
    var out=[];
    if(indexUser == 0 ){
        for (var i = 1; i < 5 ; i++){
            out.push(array[i]);
        }
    }
    else if(indexUser == 1){
        for (var i = 2; i < 6 ; i++){
            out.push(array[i]);
        }
    }
    else if(indexUser == array.length-1){
        for (var i = array.length-5; i < array.length-1 ; i++){
            out.push(array[i]);
        }
    }
    else if(indexUser == array.length-2){
        for (var i = array.length-6; i < array.length-2 ; i++){
            out.push(array[i]);
        }

    }
    else{
        for (var i = indexUser-2; i < indexUser+3 ; i++){
            out.push(array[i]);
        }
    }
    return out;
}         
//get user system document 
getUserDetails = function(id,callback){
    //get the details of user system and insert them to specify array
    console.log("inside getUserDetails id: " + id );
    User.find({}).where("_id").equals(id).
    exec(function(err,data){
        if (err) return next(err);
        return callback(data);
    });
}




