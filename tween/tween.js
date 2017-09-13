// title:  game title
// author: game developer
// desc:   short description
// script: javascript

/*TWEENER
Tic-80 Universal Tween Engine
------------------------------
TweenObject{
	objectTime,
	spriteID,
	x,
	y,
	colorKey,
	scale,
	flip,
	rotate,
	w,
	h,
	toX,
	toY,
	xEase,
	yEase,
	ybegin,
	ychange,
	yduration,
	xbegin,
	xchange,
	xduration
}

INTEGRATION INTO TIC()
-----------------------
function tic(){
	for(every TweenObject in TweenObjectArray){
		run TweenObject.update()
	}
}

*/
var TweenObjects = [];

function CreateTweenObject(options){
	var objectTime, spriteID, xStart, yStart, colorKey, scale, flip, rotate, w, h, xEnd, yEnd, xEase, yEase, xChange, yChange, xDuration, yDuration, onComplete;
	spriteID = options["spriteID"];
	xStart = options["xStart"];
	yStart = options["yStart"];

	typeof options["scale"] === 'undefined' ? scale = 1 : scale = options["scale"];
	typeof options["colorKey"] === 'undefined' ? colorKey = -1 : colorKey = options["colorKey"];
	typeof options["flip"] === 'undefined' ? flip = 0 : flip = options["flip"];
	typeof options["rotate"] === 'undefined' ? rotate = 0 : rotate = options["rotate"];
	typeof options["w"] === 'undefined' ? w = 1 : w = options["w"];
	typeof options["h"] === 'undefined' ? h = 1 : h = options["h"];
	typeof options["xChange"] === 'undefined' ? xChange = 0 : xChange = options["xChange"];
	typeof options["yChange"] === 'undefined' ? yChange = 0 : yChange = options["yChange"];
	typeof options["xEase"] === 'undefined' ? xEase = "None" : xEase  = options["xEase"];
	typeof options["yEase"] === 'undefined' ? yEase = "None" : yEase = options["yEase"];
	typeof options["xDuration"] === 'undefined'? xDuration = 0 : xDuration = options["xDuration"];
	typeof options["yDuration"] === 'undefined' ? yDuration = 0 : yDuration = options["yDuration"];
	typeof options["onComplete"] === 'undefined' ? onComplete = function(){} : onComplete = options["onComplete"];

	TweenObjects.push({
		"objectTime": 0,
		"spriteID": spriteID,
		"xStart": xStart,
		"yStart": yStart,
		"colorKey": colorKey,
		"scale": scale,
		"flip": flip,
		"rotate": rotate,
		"w": w,
		"h": h,
		"xEase": xEase,
		"yEase": yEase,
		"xChange": xChange,
		"yChange": yChange,
		"xDuration": xDuration,
		"yDuration": yDuration,
		"onComplete": onComplete
	});

}

var easingFunctions = {
	"None": function(t,b,c,d){
		return b;
	},

	"noEasing": function(time, begin, change, duration) {
		return change * time / duration + begin;
	},
	"easeInQuad": function(t, b, c, d) {
		return c*(t/=d)*t + b;
	}
}

var complete = false;

CreateTweenObject({
		"spriteID": 0,
		"xStart": 0,
		"yStart": 0,
		"xEase": "easeInQuad",
		"xChange": 30,
		"xDuration": 30,
		"onComplete": function(){
			complete = true;
		}
	});

//Add this function to the TIC() loop
function TICTweenHook(){

	for(var i = 0; i< TweenObjects.length; i++){

		var xEase = TweenObjects[i]["xEase"];
		var yEase = TweenObjects[i]["yEase"];
		var objectTime = TweenObjects[i]["objectTime"];
		var onComplete = TweenObjects[i]["onComplete"];

		//print("#####: " + easingFunctions[xEase](objectTime, TweenObjects[i]["xStart"], TweenObjects[i]["xChange"], TweenObjects[i]["xDuration"]));

		if(objectTime >= TweenObjects[i]["xDuration"]){
			onComplete();
			delete TweenObjects[0];
		}

		spr(TweenObjects[i]["spriteID"], 
			easingFunctions[xEase](objectTime, TweenObjects[i]["xStart"], TweenObjects[i]["xChange"], TweenObjects[i]["xDuration"]),
			easingFunctions[yEase](objectTime, TweenObjects[i]["yStart"], TweenObjects[i]["yChange"], TweenObjects[i]["yDuration"]),
			TweenObjects[i]["colorKey"], TweenObjects[i]["scale"], TweenObjects[i]["rotate"], TweenObjects[i]["w"],
			TweenObjects[i]["h"]);
		TweenObjects[i]["objectTime"] += 1;

	}
}

function TIC(){
	cls();
	TICTweenHook();
}
