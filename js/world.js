//initiate the canvas
var canvasElement = document.getElementById('mainCanvas');
var offset=-315;
sheetengine.scene.init(canvasElement, {w:canvasElement.width,h:canvasElement.height});
var floor=[];
var things=[];
var matrix=[];
var colours=['#FF652C','#FFE62C','#282828','#4083FF','#FFB52C'];
getFloor();
var scp = new SCP({x:14,y:6});
var me = new player({x:0,y:6});
//temporary set exit
matrix[0][6].color='red';
matrix[0][7].color='red';
_update();

