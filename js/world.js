//initiate the canvas
var canvasElement = document.getElementById('mainCanvas');
var offset=-315;
sheetengine.scene.init(canvasElement, {w:canvasElement.width,h:canvasElement.height});
var floor=[];
var things=[];
var matrix=[];

getFloor();
localStorage.scp=localStorage.scp||sc;
var scpCoord = localStorage.scp.split(',');
var scp = new SCP({x:parseInt(scpCoord[0]),y:parseInt(scpCoord[1])});
if(!localStorage.player) changeSquare({x:0,y:12},0); // SCP begins on a blue square
localStorage.player=localStorage.player||pla;
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

