$('textarea').blur(function() {
	var txt=$('#notes').val();
	localStorage.notes=txt.escapeHTML();
	console.log(txt);
});
$(function() {
	if(localStorage.notes){
		$('#notes').val(localStorage.notes.unescapeHTML());
	}
});
var canvasElement = document.getElementById('mainCanvas');
sheetengine.scene.init(canvasElement, {w:canvasElement.width,h:canvasElement.height});
var offset=-315;
var colours=['#FF652C','#FFE62C','#282828','#4083FF','#FFB52C'];
var floor=[];
var matrix=[];
var things=[];
function getMousePos(evt) {
	var rect = canvasElement.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}
//--------------Conversions (chainable)
function gridToCoords(input){
	var subj = matrix[input.x][input.y];
	return {x:parseInt(subj.centerp.x),y:parseInt(subj.centerp.y),z:0};
}
function coordsToGrid(input){
	var newX=-1*input.x+216;
	var newY=-1*input.y+242;
	return {x:newX,y:newY,z:0};
}
//------------------Hover
var lastHover;
canvasElement.onmousemove=function(event){
	//puv is the cursor position translated to sheet coords
	var puv = {
		u: event.clientX - sheetengine.canvas.offsetLeft,
		v: event.clientY - sheetengine.canvas.offsetTop
	}
	for(var x=0; x<floor.length;x++){
		var subj=floor[x];
		for(var y=0; y<subj.length;y++){
			var target=matrix[x][y];
			if(isObjectHovered(puv,target)){
				_cursor.setPosition(target.centerp);
				_update();
				lastHover=target;
			}
		}
	}
}
function changeSquare(square,colour){
	console.log("changing square from "+colours[floor[square.x][square.y]]+" to "+colours[colour]);
	floor[square.x][square.y]=colour;
	saveFloor();
	matrix[square.x][square.y].color=colours[colour];
	_update();
}
function isObjectHovered(puv, obj) {
	var ouv = sheetengine.drawing.getPointuv(obj.centerp);
	if (puv.u > ouv.u - 32 &&
	    puv.u < ouv.u - 22 + 44 &&
		    puv.v > ouv.v - 22 &&
			    puv.v < ouv.v - 22 + 68)
		return true;
	return false;
}
//-----------------create/save floor
if(localStorage.floor){
	fl2=JSON.parse(localStorage.floor);
	for (var d=0;d<Object.keys(fl2).length;d++){
		floor[d]=fl2[d];
	}
	drawFloor();

}else{
	var subj;
	for (var x=0; x<=14; x++) {
		floor[x]=[];     
		for (var y=0; y<=14; y++) {
			var colour=Number.random(0,4);
			floor[x][y]=colour;
		}
	}
	saveFloor();
	drawFloor();
}
function saveFloor(){
	var fl={};
	for(var d=0;d<floor.length;d++){
		fl[d]=floor[d];
	}
	localStorage.floor=JSON.stringify(fl);
}

//--------------draw floor
function drawFloor(){
	for(var x=0; x<floor.length;x++){
		things[x]=[];
		var subj=floor[x];
		matrix[x]=[];
		for(var y=0; y<subj.length;y++){
			things[x][y]=0;
			matrix[x][y]=basesheet = new sheetengine.BaseSheet({x:offset+x*45,y:offset+y*45,z:0}, {alphaD:90,betaD:0,gammaD:0}, {w:45,h:45});
			matrix[x][y].color = colours[subj[y]];
			matrix[x][y].dim = {x:x,y:y};
		}
	}

}
//--archway
function arch(pos){
	this.sheet = new sheetengine.Sheet({
		x: 0,
		y: 0,
		z: 0
	}, {
		alphaD: 0,
		betaD: 0,
		gammaD: 90
	}, {
		w: 200,
		h: 80
	});
	this.obj = new sheetengine.SheetObject({
		x: pos.x,
		y: pos.y,
		z: +55
	}, {
		alphaD: 0,
		betaD: 0,
		gammaD: 0
	}, [this.sheet], {
		w: 200,
		h: 80,
		relu: 20,
		relv: 50
	});
	this.obj.setShadows(false, false);
	this.sheet.context.fillStyle = '#12FF00';
	this.sheet.context.fillRect(0, 0, 200, 80);
	_update();

}
function menuHandler(){
	$('.menu1').html('Steps Taken: '+stats.movement);
	saveStats();
}
if(localStorage.stats){
	loadStats();
	menuHandler();
}else{
	var stats={movement:0};
}
function saveStats(){
	localStorage.stats=JSON.stringify(stats);
}
function loadStats(){
	stats=JSON.parse(localStorage.stats);
}
var xm=[-1,0,1,0];
var ym=[0,-1,0,1];
function displayCoords(){
	for(var i=0;i<things.length;i++){
		console.log(things[i])	
	}
}
//-----------------SCP 1384 object;
function makeSCP(pos){
	var that=this;
	this.type='scp';
	this.move=function(dir){
		//Accessable via scp.move
		var oldCoords=this.coords;
		things[oldCoords.x][oldCoords.y]=0;
		var newCoords={x:oldCoords.x+xm[dir],y:oldCoords.y+ym[dir]}
		things[newCoords.x][newCoords.y]=this;
		actuallyMove(newCoords);
	}
	function actuallyMove(coords){
		//don't move if square is yellow
		if(floor[coords.x+1][coords.y+1]==1){
			console.log('cannot move here')
			return;
		}
		//ANIMATION GOES HERE
		that.obj.setPosition(matrix[coords.x][coords.y].centerp);
		stats.movement+=1;
		menuHandler();
		that.coords=coords;
		localStorage.scpCoords=[coords.x,coords.y];
		endCheck()
		_update();
	}
	function endCheck(){
		//Check to see if over the end tiles;
	}
	this.sheet = new sheetengine.Sheet({
		x: 0,
		y: 0,
		z: 0
	}, {
		alphaD: 0,
		betaD: 0,
		gammaD: 45
	}, {
		w: 30,
		h: 64
	});
	this.obj = new sheetengine.SheetObject({
		x: pos.x,
		y: pos.y,
		z: 0
	}, {
		alphaD: 0,
		betaD: 0,
		gammaD: 0
	}, [this.sheet], {
		w: 100,
		h: 64,
		relu: 20,
		relv: 50
	});
	this.obj.setShadows(false, false);
	this.sheet.context.fillStyle = '#12FF00';
	this.sheet.context.fillRect(0, 0, 30, 64);
	_update();

}
function researcher(cor){
	this.type='res';
	things[cor.x][cor.y]=this;
	this.coords=cor;
	var pos=gridToCoords(cor)
	var that=this;
	this.move=function(dir){
		//Accessable via scp.move
		var oldCoords=this.coords;
		var newCoords={x:oldCoords.x+xm[dir],y:oldCoords.y+ym[dir]}
		console.log(oldCoords,newCoords);
		things[oldCoords.x][oldCoords.y]=0;
		if(things[newCoords.x][newCoords.y]!==0){
			if(things[newCoords.x][newCoords.y].type=='scp')
				console.log('SCP');
			else if(things[newCoords.x][newCoords.y].type=='res')
				console.log('Researcher');
			else
				console.log('occupied');
			return;
		}
		things[newCoords.x][newCoords.y]=this;
		actuallyMove(newCoords);
	}
	function actuallyMove(coords){

		//ANIMATION GOES HERE
		that.obj.setPosition(matrix[coords.x][coords.y].centerp);
		that.coords=coords;
		_update();
	}
	function endCheck(){
		//Check to see if over the end tiles;
	}
	this.sheet = new sheetengine.Sheet({
		x: 0,
		y: 0,
		z: 0
	}, {
		alphaD: 0,
		betaD: 0,
		gammaD: 45
	}, {
		w: 30,
		h: 64
	});
	this.obj = new sheetengine.SheetObject({
		x: pos.x,
		y: pos.y,
		z: 0
	}, {
		alphaD: 0,
		betaD: 0,
		gammaD: 0
	}, [this.sheet], {
		w: 100,
		h: 64,
		relu: 20,
		relv: 50
	});
	this.obj.setShadows(false, false);
	this.sheet.context.fillStyle = 'red';
	this.sheet.context.fillRect(0, 0, 30, 64);
	_update();

}
//----------drawSCP
if(localStorage.scpCoords){
	var scpCoords=localStorage.scpCoords.split(',');
	var xx=parseInt(scpCoords[0]);
	var yy=parseInt(scpCoords[1]);
	var pos=matrix[xx][yy].dim;
	var scp=new makeSCP(matrix[xx][yy].centerp);
}else{
	var pos=randomLoc();
	localStorage.scpCoords=[pos.x,pos.y];
	var scp= new makeSCP(pos.obj.centerp);
};
scp.coords=pos;
things[pos.x][pos.y]=scp;
function newGame(){
	localStorage.clear();
	location.reload();
}
function randomLoc(){
	var maxX=floor.length-1;
	var maxY=floor[0].length-2;
	var x=matrix.length-2;
	var y=Number.random(0,maxY);
	return {obj:matrix[x][y],x:x,y:y};
}
var res=[];
function makeRes(){
	var x=parseInt($('#x').val());
	var y=parseInt($('#y').val());
	res[res.length] = new researcher({x:x,y:y}); 
}
//--------shorthand for updating canvas
function _update(){
	// draw the scene
	sheetengine.calc.calculateAllSheets();
	sheetengine.drawing.drawScene(true);
}
_update();
//---------------Creating the cursor
_curs = new sheetengine.Sheet({
	x: 0,
	y: 0,
	z: 0
}, {
	alphaD: 90,
	betaD: 0,
	gammaD:0 
}, {
	w: 45,
	h: 45
});
var entrance=matrix[0][Math.floor(matrix[0].length/2)];
var entrance2=matrix[0][Math.floor(matrix[0].length/2)-1];
entrance.color='#12FF00';
entrance2.color='#12FF00';
var exit=new arch(entrance.centerp);
_curs.context.fillStyle = 'silver';
_curs.context.fillRect(0, 0, 45, 45);
//only objects can be moved, so make the cursor an object
_cursor = new sheetengine.SheetObject({
	x: 9999,
	y: 9999,
	z: 0
}, {
	alphaD: 0,
	betaD: 0,
	gammaD: 0
}, [_curs], {
	w: 45,
	h: 45,
	relu: 0,
	relv: 0
});

