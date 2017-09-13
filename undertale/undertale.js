// title:  game title
// author: game developer
// desc:   short description
// script: javascript

//== START TWEEN LIBRARY ==
var ActiveTweens = {};
var last_frame = 0;

//Variables to pass by reference
var VARIABLES = {};

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

function delta(){
	return time()/1000 - last_frame;
}

function TICTweenHook(){
	for(var i in ActiveTweens){
		//If the var_name property is asigned that means the variable is updating by reference
		if(ActiveTweens[i]["var_name"])
			step(i);
	}
}

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
//== END TWEEN LIBRARY ==

var heart_x = 116.5;
var heart_y = 65;
var heart_health = 100;

var hit_boxes = [];
var init = 0;
var debug = false;

var current_fight = "None";

/*TWEENER
Tic-80 Universal Tween Engine


*/

/*Each fight scene object has the following layout
	{
		"onStart": function(),
		"onTic": function(),
		"onEnd": function(),
	}
*/
var fight_scripts = [];

var containing_box = [90, 40, 60, 55]

create_hitbox(heart_x - 1, heart_y - 1, 10, 10);

//music(0);

function draw_health_bar(x,y,width,height){
	//Draw the Health Container
	rect(x,y,width,height, 14);
	//Draw the actual Health

	//Modified width based on current player health
	modified_width = (width * heart_health)/100;
	rect(x,y,modified_width,height, 6);
}

function TIC(){
	TICTweenHook();

	if(btnp(7, 0, 60)){
		debug = !debug	
	}

	cls(0);
	
	if(btnp(4, 0, 60)){
		start_new_fight()
	}

	if(btn(15)){
		heart_health++;
	}
	else if(btn(14)){
		heart_health--;
	}

	//The the box for the heart to move in
	rectb(containing_box[0], containing_box[1], containing_box[2], containing_box[3], 15)

	draw_health_bar(0,0,40,10);

	process_movement();
	calculate_player_boundry_collision();

	draw_debugs();
	spr(3,heart_x,heart_y, 0);


	last_frame = time()/1000;
}

function process_movement(){
	if(btn(0) && heart_y > containing_box[1] + 2)
		heart_y -= 1.25;
	if(btn(1) && heart_y < containing_box[1] + containing_box[3] - 8 - 2)
		heart_y += 1.25;
	else if(btn(2) && heart_x > containing_box[0] + 2)
		heart_x -= 1.25;
	else if(btn(3) && heart_x < containing_box[0] + containing_box[2] - 8 - 2)
		heart_x += 1.25;
}

//Calculate the collision between the player the boundry box
function calculate_player_boundry_collision(){
	if(heart_x > containing_box[0] + containing_box[2] - 8 - 2)
		heart_x -= 1.25;
	if(heart_x < containing_box[0] + 2)
		heart_x += 1.25;
	if(heart_y > containing_box[1] + containing_box[3] - 8 - 2)
		heart_y -= 1.25;
	if(heart_y < containing_box[1] + 2)
		heart_y += 1.25;

	//Set the hitbox position
	hit_boxes[0][0] = heart_x - 1;
	hit_boxes[0][1] = heart_y - 1;
}

//Calculate a collision between two hitboxes
function calculate_collision(box1, box2){
	var rect1 = {x: box1[0], y: box1[1], width: box1[2], height: box1[3]}
	var rect2 = {x: box2[0], y: box2[1], width: box2[2], height: box2[3]}
	
	if (rect1.x < rect2.x + rect2.width &&
	 rect1.x + rect1.width > rect2.x &&
		 rect1.y <  rect2.y + rect2.height &&
			 rect1.height + rect1.y > rect2.y){
		return 1;
	}	
	return 0;
}

//Returns a specific id for the hitbox
function create_hitbox(x, y, width, height){
	hit_boxes.push([x,y,width,height]);
	return hit_boxes.length;
}

//Draw the debug values
function draw_debugs(){
	if(!debug)
		return;
	
	if(btn(10)){
		containing_box[2] += 2;
		containing_box[0] -= 1
	}
	else if (btn(11)){
		containing_box[2] -= 2;
		containing_box[0] += 1;
	}

	if(btn(8)){
		containing_box[3] += 2;
		containing_box[1] -= 1
	}
	else if (btn(9)){
		containing_box[3] -= 2;
		containing_box[1] += 1;
	}

	print_debuglines(0, [
			"DEBUG MENU",
			"BOX W: " + containing_box[2] + " H: " + containing_box[3],
			"CURRENT FIGHT : " + current_fight
		]);

	//Draws the hitboxes
	for(var i = 0; i < hit_boxes.length; i++){
		box = hit_boxes[i];
		rectb(box[0], box[1], box[2], box[3], 6);
	}
}

function print_debuglines(x_pos, strings){
	for(var i = 0; i < strings.length; i++){
		print(strings[i], x_pos, i * 10)
	}
}

function start_new_fight(){
	//Rnadomly choose a fight routine
	var rand = Math.floor(Math.random() * fight_scripts.length);
	fight_scripts[rand].onStart();
}

// fight name : Test Fight 1
// author : Andros Yang
// desc : This is a test fight
fight_scripts.push({
	"onStart": function(){
		current_fight = "Test 1";
		
	}
});