// Variablen deklarieren

var generator, generatorLevel, asteroidLevel, asteroidSpeed, shuttle, shuttleLevel, shuttleHP, shieldHP, hud, score, scoreDisplay, lvl, lvlDisplay, hpDisplay, shieldDisplay, startScreen, finalScreen, startBtn, finalScore, resetBtn, css;

var aniSpeed = 25;
var asteroidClasses = 3;
var bonus = 4;
var asteroidSize = 15;
var asteroidColor = 100;
var asteroidColorOffset = 50;
var shuttleSpeed = 10;
var shotSize = 4;
var shotSpeed = 10;
var hitpoints = 42;
var lvlup = 1500;
var hpColors = ["#300", "#600", "#930", "#C60", "#C90", "#CC0", "#9C0", "#6C0", "#3C0", "#0C0"];

var keys = new Array();

// Prepare Game

function initGame() {
	asteroidLevel = document.getElementById('asteroidLevel');
	shuttleLevel = document.getElementById('shuttleLevel');
	shuttle = document.getElementById('shuttle');
	hud = document.getElementById('hud');
	scoreDisplay = document.getElementById('score');
	lvlDisplay = document.getElementById('level');
	hpDisplay = document.getElementById('healthpoints');
	shieldDisplay =document.getElementById('shield');
	startScreen = document.getElementById('startScreen');
	startBtn = document.getElementById('startBtn');
	finalScreen = document.getElementById('finalScreen');
	finalScore = document.getElementById('finalScore');
	resetBtn = document.getElementById('resetBtn');
	
	startBtn.onclick = function() { resetGame(); }
	resetBtn.onclick = function() { resetGame(); }
	
	startScreen.style.display = "block";
}

// Startwerte setzen und Spiel starten 
// Set initial values and restart game

function resetGame() {
	
	generatorLevel = 3000;
	asteroidSpeed = 1;
	shuttleHP = 10;
	shieldHP = 0;
	score = 0;
	lvl = 1;
	
	setCSS(startScreen, { display:'none' });
	setCSS(finalScreen, { display:'none' });
	setCSS(asteroidLevel, { display:'block' });
	setCSS(shuttleLevel, { display:'block' });
	setCSS(hud, { display:'block' });
	setCSS(shuttle, {
		top:(window.innerHeight - (1.5 * shuttle.offsetHeight)) + "px",
		left:((window.innerWidth - shuttle.offsetWidth)/2) + "px",
		display:"block"
	});
	setCSS(hpDisplay, { 
		width:"198px",
		backgroundColor:hpColors[9]
	});
	setCSS(shieldDisplay, { 
		width:"0px",
		display:"none"
	});
	
	scoreDisplay.innerHTML = "Score: " + score;
	lvlDisplay.innerHTML = "Level: " + lvl;
	generator = setInterval(createAsteroid, generatorLevel);
	getKey();
}

// Asteroiden erzeugen
// Create Asteroids
/* *************************************************************** */

function createAsteroid() {
	var asteroid = document.createElement('DIV');
	var cls = 1 + Math.floor(Math.random() * (asteroidClasses * bonus + 1));
	var size = 1;
	var r = asteroidColor + Math.round(Math.random() * asteroidColorOffset);
	var g = asteroidColor + Math.round(Math.random() * asteroidColorOffset);
	var b = asteroidColor + Math.round(Math.random() * asteroidColorOffset);
	var color = "rgb(" + r + "," + g + "," + b + ")";
	
	if(cls > asteroidClasses * bonus) {
		cls = 0;
		size = asteroidSize/3;
		color = "rgb(0, 225, 0)";
		asteroid.score = 0;
	} else {
		cls = 1 + cls%asteroidClasses;
		size = cls * asteroidSize;
		asteroid.score = asteroidClasses + 1 - cls;
	}
	
	var xPos = Math.round(Math.random() * (window.innerWidth - size));
	setCSS(asteroid, {
		width:size+"px",
		height:size+"px",
		backgroundColor:color,
		borderRadius:"50%",
		position:"absolute",
		top:-size+"px",
		left:xPos+"px"
	});
		
	asteroid.that = asteroid;
	asteroid.move = setInterval(function() {moveAsteroid(asteroid.that)}, aniSpeed);
	asteroidLevel.appendChild(asteroid);
}
function moveAsteroid(target) {
	var yPos = target.offsetTop;
	if(yPos >= window.innerHeight) {
		clearInterval(target.move);
		asteroidLevel.removeChild(target);
		delete target;
	} else {	
		target.style.top = (yPos + asteroidSpeed) + "px";
		collision(target);
	}
}

// Waffenfeuer
// Fire Weapon
/* *************************************************************** */

function fireWeapon() {
	var shot = document.createElement('DIV');
	var shotS = shotSize;
	var shotX = shuttle.offsetLeft + (shuttle.offsetWidth-shotS)/2;
	var shotY = shuttle.offsetTop - shotS;
	
	setCSS(shot, {
		position:"absolute",
		top:shotY + "px",
		left:shotX + "px",
		width:shotS + "px",
		height:shotS + "px"
	});
	
	shot.setAttribute('class', 'shot');
	shot.that = shot;
	shot.move = setInterval(function(){moveShot(shot.that)}, aniSpeed);
	shuttleLevel.appendChild(shot);
}
function moveShot(target) {
	var yPos = target.offsetTop;
	if(yPos < 0) {
		clearInterval(target.move);
		shuttleLevel.removeChild(target);
		delete target;
	} else {
		target.style.top = yPos - shotSpeed + "px";
		hittest(target);
	}
}

// Kollisionstest Waffen / Asteroiden
// Collision test shot / asteroid
function hittest(shot) {
	var asteroids = asteroidLevel.getElementsByTagName('DIV');
	var sxm = shot.offsetLeft + shot.offsetWidth/2;
	var sym = shot.offsetTop + shot.offsetHeight/2;
	
	for(var i = 0; i < asteroids.length; i++) {
		
		var axm = asteroids[i].offsetLeft + asteroids[i].offsetWidth/2;
		var aym = asteroids[i].offsetTop + asteroids[i].offsetHeight/2;
		var dx = axm - sxm;
		var dy = aym - sym;
		var d = Math.sqrt((dx * dx) + (dy * dy));
		
		if(d < shot.offsetWidth/2 + asteroids[i].offsetWidth/2) {
			clearInterval(shot.move);
			shuttleLevel.removeChild(shot);
			delete shot.move;
			delete shot;
			
			score += asteroids[i].score * hitpoints;
			if(lvl < Math.floor(score/lvlup) + 1) {
				lvl = Math.floor(score/lvlup) + 1;
				generatorLevel *= 0.8;
				asteroidSpeed *= 1.1;
				clearInterval(generator);
				generator = setInterval(createAsteroid, generatorLevel);
			} 
			scoreDisplay.innerHTML = "Punkte: " + score;
			lvlDisplay.innerHTML = "Level: " + lvl;
			
			if(Math.random() < 0.1) {
				asteroids[i].score = -1;
			}
			
			if(asteroids[i].score > 0){
				asteroids[i].score++;
			}
			
			if(asteroids[i].score > asteroidClasses || asteroids[i].score == 0) {
				clearInterval(asteroids[i].move);
				asteroidLevel.removeChild(asteroids[i]);
				if(asteroids[i] != undefined){
					delete asteroids[i].move;
					delete asteroids[i];
				}
			} else if(asteroids[i].score == -1) {
				setCSS(asteroids[i], {
					width:asteroidSize/3 + "px",
					height:asteroidSize/3 + "px",
					backgroundColor:"#6CF",
					left:axm - asteroidSize/6 + "px",
					top:aym + asteroidSize/6 + "px"
				});
			} else {
				var size = asteroidClasses + 1 - asteroids[i].score;
				asteroids[i].style.width = size * asteroidSize + "px";
				asteroids[i].style.height = size * asteroidSize + "px";
				asteroids[i].style.left = asteroids[i].offsetLeft + asteroidSize/2 + "px";
				asteroids[i].style.top = asteroids[i].offsetTop + asteroidSize/2 + "px";
			}
		}
	}
}
function collision(asteroid) {
	var axm = asteroid.offsetLeft + asteroid.offsetWidth/2;
	var aym = asteroid.offsetTop + asteroid.offsetHeight/2;
	var sxm = shuttle.offsetLeft + shuttle.offsetWidth/2;
	var sym = shuttle.offsetTop + shuttle.offsetHeight/2;
	var dx = axm - sxm;
	var dy = aym - sym;
	var d = Math.sqrt(dx*dx + dy*dy);
	if(d < shuttle.offsetWidth/2 + asteroid.offsetWidth/2) {
		
		if(asteroid.score > 0) {
			var hit = shieldHP - (asteroidClasses + 1 - asteroid.score);
			if(hit < 0) {
				shieldHP = 0;
				shuttleHP += hit;
			} else {
				shieldHP = hit;
			}
		} else if(asteroid.score == 0) {
			if(shuttleHP < 10) {
				shuttleHP = 10;
			}
		} else {
			shieldHP = 10;
		}
		
		clearInterval(asteroid.move);
		asteroidLevel.removeChild(asteroid);
		delete asteroid.move;
		delete asteroid;
		
		var img = "shuttle";
		if(shuttleHP <= 0) {
			shuttleHP = 0;
			shuttle.display = "none";
			endGame();
		} else if(shuttleHP <= 2) {
			img = "shuttle5";
		} else if(shuttleHP <= 4) {
			img = "shuttle4";
		} else if(shuttleHP <= 6) {
			img = "shuttle3";
		} else if(shuttleHP <= 8) {
			img = "shuttle2";
		} 
		setCSS(shuttle, {
			backgroundImage:"url(img/" + img + ".png)",
			boxShadow:"rgba(159,207,255," + (0.1 * shieldHP) + ") 0px 0px 10px 3px"
		});
		setCSS(hpDisplay, {
			width:19.8 * shuttleHP + "px",
			backgroundColor:hpColors[shuttleHP-1]
		});
		if(shieldHP == 0){
			setCSS(shieldDisplay, {
				display:"none"
			});
		} else {
			setCSS(shieldDisplay, {
				display:"block",
				width:19.8 * shieldHP + "px"
			});
		}
		
	}
}

// GameOver

function endGame() {
	var asteroids = asteroidLevel.getElementsByTagName('DIV');
	var shots = shuttleLevel.getElementsByClassName('shot');
	var i;
	clearInterval(generator);
	for(i = asteroids.length-1; i > -1; i--) {
		clearInterval(asteroids[i].move);
		asteroidLevel.removeChild(asteroids[i]);
		delete asteroids[i];
	}
	for(i = shots.length-1; i > -1 ; i--) {
		clearInterval(shots[i].move);
		shuttleLevel.removeChild(shots[i]);
		delete shots[i];
	}
	asteroidLevel.style.display = "none";
	shuttleLevel.style.display = "none";
	hud.style.display = "none";
	
	var txt = "You made it to Level " + lvl + " and got " + score + " Points. Try again?";
	finalScore.innerHTML = txt;
	finalScreen.style.display = "block";
}

// Tastensteuerung
// Keyboard control
function getKey() {
	window.onkeydown = function(event) {
		keys[event.keyCode] = true;
		moveShuttle();
	}
	window.onkeyup = function(event) {
		keys[event.keyCode] = false;
		moveShuttle();
	}
}
function moveShuttle() {
	var shuttleX = shuttle.offsetLeft;
	var shuttleY = shuttle.offsetTop;
	var right = window.innerWidth - shuttle.offsetWidth;
	var bottom = window.innerHeight - shuttle.offsetHeight;
	
	if((keys[37] == true || keys[65] == true) && shuttleX > 0){
		shuttle.style.left = shuttleX - shuttleSpeed + "px";
	}
	if((keys[38] == true || keys[87] == true) && shuttleY > 0){
		shuttle.style.top = shuttleY - shuttleSpeed + "px";
	}
	if((keys[39] == true || keys[68] == true) && shuttleX < right){
		shuttle.style.left = shuttleX + shuttleSpeed + "px";
	}
	if((keys[40] == true || keys[83] == true) && shuttleY < bottom){
		shuttle.style.top = shuttleY + shuttleSpeed + "px";
	}
	if(keys[32] == true){
		fireWeapon();
	}
}
