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

var init = false;


function draw_ray(angle) {
	//Calculate the components to the ray dir vector
    var rayDirX = Math.cos(angle * Math.PI / 180);
    var rayDirY = Math.sin(angle * Math.PI / 180);

    //get the distance required for the ray to travel 1 x-unit
    var deltaDistX = Math.abs(1 / rayDirX);
    //get the distance required for the ray to travel 1 y-unit
    var deltaDistY = Math.abs(1 / rayDirY);

    //You need to convert cords to a single cordinate system when performing ray calculations
    var worldCords = screen_to_map(x, y);

    //Round down to get the actual tile that the player is on
    var mapX = Math.floor(worldCords[0]);
    var mapY = Math.floor(worldCords[1]);

    //Distance required for ray (including direction) to travel to the next x/y-unit 
    var sideDistX;
    var sideDistY;

    //StepX and StepY indicate how the algorithm should step to the next tile
    //can only be -1, 0, 1
    var stepX;
    var stepY;

    //Hit indicates the color that was hit
    var hit = 0;
    //Hit indicates the side that was hit
    var side;

    //If the ray is going left...
    if (rayDirX < 0) {
    	//You want to stepX left once every time
        stepX = -1;
        //Think of this as calculating a smaller hyp by using proportions
        /*
		 sideDistX (hyp)                       deltaDistX (hyp)
		-------------                       = -------------------
		 wordCords[0] - mapX (base)              1  (base)
        */
        sideDistX = (worldCords[0] - mapX) * deltaDistX;
    } else {
        //You want to stepX right once every time
        stepX = 1;
        sideDistX = (mapX + 1.0 - worldCords[0]) * deltaDistX;
    }
    if (rayDirY < 0) {
    	//You want to stepY down once every time
        stepY = -1;
        sideDistY = (worldCords[1] - mapY) * deltaDistY;
    } else {
    	//You want to stepY up once every time
        stepY = 1;
        sideDistY = (mapY + 1.0 - worldCords[1]) * deltaDistY;
    }


    //Limit the number of iterations a ray can take (to prevent crashes/hangs)
    const MAX_ITER = 300;
    var iter = 0;

    //perform DDA
    while (hit == 0) {
        //First check to see which side is smaller. 
        //The smaller one is the side that will be hit first
        if (sideDistX < sideDistY) {
        	//the X-side will be hit before the Y-side
            sideDistX += deltaDistX;
            //Actually perform the step
            mapX += stepX;
            //Tell the method caller that we hit the X-side
            side = 0;
        } else {
            sideDistY += deltaDistY;
            mapY += stepY;
            //Tell the method caller that we hit the Y-side
            side = 1;
        }

        //The actual check to see if ray has hit a wall
        hit = mget(mapX, mapY);

        //If we have a hit...
        if (hit != 0) {
            var final = map_to_screen(mapX, mapY);

            //If we're on 2D-mode actually draw the rays
            if (screen == 0)
                line(x, y, final[0], final[1], 15);

            var distance = Math.sqrt((final[0] - x) * (final[0] - x) + (final[1] - y) * (final[1] - y));
            return [hit, distance, side];
        }
        iter += 1;

        //Error handler...
        if (iter >= MAX_ITER)
            return [0, 1000];
    }
}

var mouseLastX = mouse()[0];
function update_yaw() {
    var mouseObj = mouse();
    yaw += (mouseObj[0] - mouseLastX) * SENSITIVITY;
    mouseLastX = mouseObj[0];
}

//maps are 29x16, while resolution is 240x136
function screen_to_map(x, y) {
    const xScale = 29 / 240;
    const yScale = 16 / 136;
    return [x * xScale, y * yScale];
}

function map_to_screen(x, y) {
    const xScale = 240 / 29;
    const yScale = 136 / 16;
    return [x * xScale, y * yScale];
}

function TIC() {
/*	//Run this block only once
	if(init == false) {
		//Customize the color palette

	}*/


    cls();

    if (screen == 0) {
        map(0, 0);
        circ(x, y, 1, 15);
        draw_debug();
        print("Overhead View");
    } else {
        draw_3d();
        print("First Person View");
    }

    if (key(60))
        yaw -= 3;
    if (key(61))
        yaw += 3;

    //W
    if (key(23)) {
        var dirX = Math.cos((yaw + 90) * Math.PI / 180);
        var dirY = Math.sin((yaw + 90) * Math.PI / 180);
        x += dirX;
        y += dirY;
    }
    //S
    if (key(19)) {
        var dirX = Math.cos((yaw + 90) * Math.PI / 180);
        var dirY = Math.sin((yaw + 90) * Math.PI / 180);
        x -= dirX;
        y -= dirY;
    }
    //A
    if (key(1)) {
        var dirX = Math.cos((yaw) * Math.PI / 180);
        var dirY = Math.sin((yaw) * Math.PI / 180);
        x += dirX;
        y += dirY;
    }
    //D
    if (key(4)) {
        var dirX = Math.cos((yaw) * Math.PI / 180);
        var dirY = Math.sin((yaw) * Math.PI / 180);
        x -= dirX;
        y -= dirY;
    }

    //B
    if (keyp(2)) {
        screen += 1;
    }
    //C
    if (keyp(3)) {
        screen -= 1;
    }
}

function draw_debug() {
    var step = FOV / WIDTH;
    var start = 90 - (FOV / 2);
    for (var i = 0; i < WIDTH; i++) {
        draw_ray(yaw + start);
        start += step;
    }
}

function draw_3d() {
    var step = FOV / WIDTH;
    var start = 90 - (FOV / 2);
    for (var i = 0; i < WIDTH; i++) {
        var result = draw_ray(yaw + start);

        if(result[2] == 1)
        	drawLine(i, result[0], (800 / result[1]));
        else
        	drawLine(i, result[0] + 3, (800 / result[1]));

        start += step;
    }
}

function drawLine(xPos, color, length) {
    var startY = HEIGHT / 2;
    line(xPos, startY - length / 2, xPos, startY + length / 2, color);
}