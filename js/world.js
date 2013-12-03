//initiate the canvas
var canvasElement = document.getElementById('mainCanvas');
var offset=-315;
sheetengine.scene.init(canvasElement, {w:canvasElement.width,h:canvasElement.height});
var floor=[];
var things=[];
var matrix=[];

var colours=['#FF652C','#FFE62C','#282828','#4083FF','#FFB52C'];
var colours2=['#FF8C61','#FFED61','#5E5E5E','#70A2FF','#FFC861'];
//var colours2=['#BF4C21','#BFAD21','#1E1E1E','#3062BF','#BF8821'];
var colours3=['#803316','#807316','#141414','#204280','#805B16'];
getFloor();
localStorage.scp=localStorage.scp||'14,6';
var scpCoord = localStorage.scp.split(',');
var scp = new SCP({x:parseInt(scpCoord[0]),y:parseInt(scpCoord[1])});
if(!localStorage.player) changeSquare({x:0,y:12},0); // SCP begins on a blue square
localStorage.player=localStorage.player||'0,12';
var playerCoord = localStorage.player.split(',');
var me = new player({x:parseInt(playerCoord[0]),y:parseInt(playerCoord[1])});
var exit=new arch();
//temporary set exit
if(debug){
	matrix[0][11].color='red';
	matrix[0][12].color='red';
	matrix[0][13].color='red';
	matrix[scpCoord[0]][scpCoord[1]].color='green';
	matrix[playerCoord[0]][playerCoord[1]].color='green';
}
_update();

