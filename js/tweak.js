//Global variables for tweaking
var debug=0;
//---------------
var colours=['#FF652C','#FFE62C','#282828','#4083FF','#FFB52C'];//tiles
var colours2=['#FF8C61','#FFED61','#5E5E5E','#70A2FF','#FFC861'];//lighter
var colours3=['#803316','#807316','#141414','#204280','#805B16'];//darker
var colours4=['#BF4C21','#BFAD21','#1E1E1E','#3062BF','#BF8821'];//in betweem 0 and 3 for gaps
//initial coords.
var pla='0,12';//  PLAYER:
var sc='14,6';//  SCP
var _tillMove=50;//time till SCP moves by itself
var _padLength=4;//number of digits on timer
_minHoles=2;
_maxHoles=5;
_minCubes=3;
_maxCubes=6;
_cubeRotation=90;
_defaultText='SCP moves if:\n███████\n██████ or █████\n███████ followed by ████';//only appears once
//--------------------------KEYCODES
// for keycodes, go to
// http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
// move left 	- LEFT
var _ml = 37;
// move up 	- UP
var _mu = 38;
// move right 	- RIGHT
var _mr = 39;
// move down 	- DOWN
var _md = 40;
// pause game 	- P
var _pg  = 80;
// settings 	- ;
var _se = 186;
// help 	- ?
var _he = 191;
// fullscreen	- F
var _fu = 70;
// menu		- M
var _me = 77;
