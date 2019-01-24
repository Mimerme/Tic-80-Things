// title:  game title
// author: game developer
// desc:   short description
// script: js

const WIDTH = "240";
const HEIGHT = "136";
const FOV = 90;
const SENSITIVITY = 0.5;

var x = 25;
var y = 25;
var yaw = 45;

//0 - 2d
//1 - 3d
var screen = 0;

function calc_ray_steps(rayXDir, rayYDir){
	var mapCords = screen_to_map(x, y);

	//Determines which side of the tile we will be looking at
	//1 : right
	//-1 : left
	//0: vertical
	var horiz = 0;
	var vert = 0;

	if(rayXDir > 0)
		horiz = 1;
	else if(rayXDir < 0)
		horiz = -1;
	else
		horiz = 0;

	if(rayYDir > 0)
		vert = 1;
	else if(rayYDir < 0)
		vert = -1;
	else
		vert = 0;

	var nextX;
	if(horiz == 1)
		nextX = Math.ceil(mapCords[0]) - mapCords[0]
	else
		nextX = mapCords[0] - Math.floor(mapCords[0])

	var nextY;
	if(vert == 1)
		nextY = Math.ceil(mapCords[1]) - mapCords[1];
	else
		nextY = Math.floor(mapCords[1]) - mapCords[1];


	print(horiz, 0, 10);
	print(vert, 0, 20);

	if(horiz == 0)
		return [nextY];
	else if(vert == 0)
		return [nextX];
	else if(nextY < nextX)
		return[nextY, nextX];
	else if(nextY > nextX){
		return[nextX, nextY];
	}
}

//given the starting position & angle: draw the line
//UPDATE: NOW ALSO STOPS ONLY ON CLLISION
//Returns hit tile and distance
function draw_ray(angle, distance){
	//Convert the angle into degrees and calculate the slope
	//var slope = Math.tan(angle * Math.PI/180);

	//Calculate the unit vector (since we know the hyp is =1)
	var rayDirX = Math.cos(angle * Math.PI/180);
	var rayDirY = Math.sin(angle * Math.PI/180);

/*	endX *= distance;
	endY *= distance;*/

	//var deltaDistX = Math.sqrt(1 + (rayDirY * rayDirY) / (rayDirX * rayDirX));
	//var deltaDistY = Math.sqrt(1 + (rayDirX * rayDirX) / (rayDirY * rayDirY));
	var deltaDistX = Math.abs(1 / rayDirX);
	var deltaDistY = Math.abs(1 / rayDirY);

	var worldCords = screen_to_map(x, y);

	var mapX = Math.floor(worldCords[0]);
	var mapY = Math.floor(worldCords[1]);

	var sideDistX;
	var sideDistY;

	var stepX;
	var stepY;

	var hit = 0;
	var side;

    if (rayDirX < 0)
    {
      stepX = -1;
      sideDistX = (worldCords[0] - mapX) * deltaDistX;
    }
    else
    {
      stepX = 1;
      sideDistX = (mapX + 1.0 - worldCords[0]) * deltaDistX;
    }
    if (rayDirY < 0)
    {
      stepY = -1;
      sideDistY = (worldCords[1] - mapY) * deltaDistY;
    }
    else
    {
      stepY = 1;
      sideDistY = (mapY + 1.0 - worldCords[1]) * deltaDistY;
    }



    const MAX_ITER = 300;
    var iter = 0;
      //perform DDA
      while (hit == 0)
      {
        //jump to next map square, OR in x-direction, OR in y-direction
        if (sideDistX < sideDistY)
        {
          sideDistX += deltaDistX;
          mapX += stepX;
          side = 0;
        }
        else
        {
          sideDistY += deltaDistY;
          mapY += stepY;
          side = 1;
        }
        //Check if ray has hit a wall

        hit = mget(mapX, mapY);
        if (hit != 0){
        	var final = map_to_screen(mapX, mapY);

        	if(screen == 0)
        		line(x,y,final[0], final[1], 15);

        	var distance = Math.sqrt((final[0] - x) * (final[0] - x) + (final[1] - y) * (final[1] - y));
        	return[hit, distance];
        }
        iter += 1;

        if(iter >= MAX_ITER)
        	break;
      }

/*	const step = 1;
	var saved_steps = x;
	do{
		//Plugin to the line equation
		endY = slope * (saved_steps - x) + y;
		saved_steps += step;

		if(saved_steps >= 200)
			break;

		var mapCords = screen_to_map(saved_steps, endY);
	} while(mget(Math.floor(mapCords[0]), Math.floor(mapCords[1]))== 0);
	
	//var distance = Math.sqrt((saved_steps - x) * (saved_steps - x) + (endY - y) * (endY - y));
	line(x, y, Math.floor(saved_steps), Math.floor(endY), 15);*/


	//line(x, y, x + endX, y + endY, 15);
}

//Line equation: y(x) = m(x - h) + k
function line_equ(x, h, k, m){
	return m * (x - h) + k;
}

//Solving for x: 
function line_equ_x(y, h, k, m){
	return ((y - k) / m) + h;
}

var mouseLastX = mouse()[0];
function update_yaw(){
	var mouseObj = mouse();
	yaw += (mouseObj[0] - mouseLastX) * SENSITIVITY;
	mouseLastX = mouseObj[0];
}

//maps are 29x16, while resolution is 240x136
function screen_to_map(x, y){
	const xScale = 29 / 240;
	const yScale = 16 / 136;
	return [x * xScale, y * yScale];
}

function map_to_screen(x, y){
	const xScale = 240 / 29;
	const yScale = 136 / 16;
	return [x * xScale, y * yScale];
}

function TIC() {
	cls();

	if(screen == 0){
		map(0,0);
		circ(x, y, 1, 15);
		draw_debug();
	}
	else{
		draw_3d();
	}

	if(key(60))
		yaw -= 3;
	if(key(61))
		yaw += 3;

	//W
	if(key(23)) {
		var dirX = Math.cos((yaw + 90) * Math.PI/180);
		var dirY = Math.sin((yaw + 90) * Math.PI/180);
		x += dirX;
		y += dirY;
	}
	//S
	if(key(19)) {
		var dirX = Math.cos((yaw + 90) * Math.PI/180);
		var dirY = Math.sin((yaw + 90) * Math.PI/180);
		x -= dirX;
		y -= dirY;
	}
	//A
	if(key(1)) {
		var dirX = Math.cos((yaw) * Math.PI/180);
		var dirY = Math.sin((yaw) * Math.PI/180);
		x += dirX;
		y += dirY;
	}
	//D
	if(key(4)) {
		var dirX = Math.cos((yaw) * Math.PI/180);
		var dirY = Math.sin((yaw) * Math.PI/180);
		x -= dirX;
		y -= dirY;
	}

	//B
	if(keyp(2)) {
		screen += 1;
	}
	//C
	if(keyp(3)) {
		screen -= 1;
	}

	print("Screen : " + screen);
}

function draw_debug(){
	var step = FOV / WIDTH;
	var start = 90 - (FOV / 2);
	for(var i = 0; i < WIDTH; i++){
		draw_ray(yaw + start, 25);
		start += step;
	}
}

function draw_3d(){
	var step = FOV / WIDTH;
	var start = 90 - (FOV / 2);
	for(var i = 0; i < WIDTH; i++){
		var result = draw_ray(yaw + start, 25);
		drawLine(i, result[0], (800 / result[1]));
		start += step;
	}
}

function drawLine(xPos, color, length){
	var startY = HEIGHT / 2;
	line(xPos, startY - length / 2, xPos, startY + length / 2, color);
}