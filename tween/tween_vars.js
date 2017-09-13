// title:  VarTween
// author: Andros (Mimerme) Yang
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
var ActiveTweens = {};
var last_frame = 0;

//Variables to pass by reference
var VARIABLES = {
	"SquareX": 0
};

function CreateTweenObject(options){
	//You can pass a variable by reference by passing in a hasmap and index of the variable
	var ease, change, duration, onComplete, running, var_ref, var_ref_index, running, id;
	start = options["start"];

	typeof options["change"] === 'undefined' ? change = 0 : change = options["change"];
	typeof options["ease"] === 'undefined' ? ease = "None" : ease  = options["ease"];
	typeof options["duration"] === 'undefined'? duration = 0 : duration = options["duration"];
	typeof options["onComplete"] === 'undefined' ? onComplete = function(){} : onComplete = options["onComplete"];
	typeof options["var_ref"] === 'undefined' ? var_ref = VARIABLES : var_ref = options["var_ref"];
	typeof options["var_name"] === 'undefined' ? var_ref_index = false : var_ref_index = options["var_name"];
	typeof options["running"] === 'undefined' ? running = true : running = options["running"];
	typeof options["id"] === 'undefined' ? id = Math.random().toString(9).substring(7) : id = options["id"];

	ActiveTweens[id] = {
		"objectTime": 0,
		"start": start,
		"change": change,
		"ease": ease,
		"duration": duration,
		"onComplete": onComplete,
		"var_ref": var_ref,
		"var_name": var_ref_index,
		"running": running
	};

}

//You can add more easing functions here
/*
t - time
b - starting value
c - change in value
d - duration
*/
var easingFunctions = {
	"None": function(t,b,c,d){
		return b;
	},

	"noEasing": function(t, b, c, d) {
		return change * time / duration + begin;
	},
	"easeInQuad": function(t, b, c, d) {
		return c*(t/=d)*t + b;
	}
}

CreateTweenObject({
		"start": 0,
		"ease": "easeInQuad",
		"change": 200,
		"duration": 10,
		"var_name": "SquareX",
		"id": "SquareX"
	});

CreateTweenObject({
		"start": 0,
		"ease": "easeInQuad",
		"change": 200,
		"duration": 10,
		"id": "SquareXR"
	});

function delta(){
	return time()/1000 - last_frame;
}

//This hook is meant for ActiveTweens with a variable passed in by reference
//Add this function to the TIC() loop
function TICTweenHook(){
	for(var i in ActiveTweens){
		//If the var_name property is asigned that means the variable is updating by reference
		if(ActiveTweens[i]["var_name"])
			step(i);
	}
}

//Step individual Tween Objects
function step(i){

	var ease = ActiveTweens[i]["ease"];
	var onComplete = ActiveTweens[i]["onComplete"];

	//TODO: incrase object time by delta
	if(ActiveTweens[i]["running"])
		ActiveTweens[i]["objectTime"] += delta();

	var objectTime = ActiveTweens[i]["objectTime"];

	if(objectTime >= ActiveTweens[i]["duration"]){
		onComplete(i);
		ActiveTweens[i]["running"] = false;

		//Delete tweens passed by reference
		if(ActiveTweens[i]["var_name"]){
			delete(ActiveTweens[i]);
			return;
		}
	}

	var new_val = easingFunctions[ease](objectTime, ActiveTweens[i]["start"], ActiveTweens[i]["change"], ActiveTweens[i]["duration"]);
	//If var_ref is defined then set the new value by reference
	if(ActiveTweens[i]["var_name"]){
		ActiveTweens[i]["var_ref"][ActiveTweens[i]["var_name"]] = new_val;
		return;
	}

	//Return the new value in case anyone doesn't want to pass by reference
	return new_val;

}

function TIC(){
	cls();
	TICTweenHook();
/*	print(ActiveTweens["SquareX"]["objectTime"] + " : " + ActiveTweens["SquareXR"]["objectTime"], 0, 40);*/
	spr(0, step("SquareXR"), 0);
	spr(0, VARIABLES["SquareX"],20);
	last_frame = time()/1000;
}
