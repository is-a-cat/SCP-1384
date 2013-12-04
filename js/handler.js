// type #debug and reload for debugging menu
var debug=(window.location.hash=='#debug'?1:0);
var first = ((!localStorage.player)||(localStorage.player=="0,12"&&localStorage.scp=="14,6")?1:0); // set 'first' flag if the player's position is undefined or the starting coordinates
var a=0;
window.onload = function(e){ 
	a=1;
	stats=document.getElementById('extraInfo');
	if(first){
		document.getElementById("everything").className='blur';
		document.getElementById('dimmer').style.display = 'block';
		document.getElementById('dimmer').style.zindex = '10';	
		document.getElementById('modal').style.display = 'block';
	}
	if(localStorage.notes)
		document.getElementById('notes').value=localStorage.notes;
	updateStats();

}
function rollover(text,clear){
	var subj=document.getElementById('tooltip');
	subj.innerHTML=text;
	if(clear!=0){
		var count=0;
		var cls=setInterval(function(){
			count++;
			if(count==clear){
				subj.innerHTML='';
				//rollover('');
				window.clearInterval(cls);
				count=0;
			}
		},100);
	}

}
var fsText='Go full screen';
function fullScreen(){
	if (fsText=='Go full screen'){
		fsText='Exit full screen';
		document.getElementById('fs').src='img/small.png';
		document.getElementById('switch2').checked=true;
	}else{
		document.getElementById('switch2').checked=false
		document.getElementById('fs').src='img/full.png';
		fsText='Go full screen';
	}
	var
	el = document.documentElement
		, is = document.mozFullScreen 
	|| document.webkitIsFullScreen
		, rfs =
	el.requestFullScreen
		|| el.webkitRequestFullScreen
			|| el.mozRequestFullScreen
		, cfs = 
	document.exitFullscreen
		|| document.mozCancelFullScreen
			|| document.webkitCancelFullScreen;
			if(is)  cfs.call(document);
			else    rfs.call(el);
}
function updateStats(){
	if(!a) return;
	var stat={
		scp:{
			x:scp.x,
			y:scp.y
		},
		me:{
			x:me.x,
			y:me.y,
		}
	};
	stats.innerHTML="SCP: ["+stat.scp.x+", "+stat.scp.y+"]<br>Player: ["+stat.me.x+", "+stat.me.y+"]";
}
function saveText(){ // save the notes
	rollover('Text saved',20);
	localStorage.notes=document.getElementById('notes').value;
}
function dim() { //calls a big semi-transparent box to dim the screen
	var e = document.getElementById('dimmer');
	if(e.style.display !== 'none'){
		e.style.display = 'none';
		e.style.zIndex = '0';
	}else{

		e.style.display = 'block';
		e.style.zIndex = '10';
	}
}
function notecheckbox(){ 
	document.getElementById('notes').style.display='none';
}
	var fade;
function toggle_visibility(id) {
	var e = document.getElementById(id);
	if(e.style.display !== 'none'){
		fade=setInterval(function(){
			if(!e.style.opacity) e.style.opacity=1;
			if(e.style.opacity>0.10000000000000014){
				e.style.opacity-=0.1;
			}else{
				clearInterval(fade);
				e.style.display = 'none';
			}
		},50);
	}else{
		clearInterval(fade);
		e.style.opacity=1;
				e.style.display = 'block';

	}
}
function modal(){
	document.getElementById("everything").className=0;
	toggle_visibility('modal');
	dim();
}
function newGame(auto){//start a new game. auto flag determines conformation box
	if(!auto){
		var check=confirm("Really start a new Game?");
		if(!check){
			return;
		}
	}
	localStorage.clear();
	location.reload();
}
function getFloor(){ 
	if(localStorage.floor){ // if it exists, parse the JSON colours from localstorage and run drawfloor()
		fl2=JSON.parse(localStorage.floor);
		for (var d=0;d<Object.keys(fl2).length;d++){
			floor[d]=fl2[d];
		}
		drawFloor();

	}else{ // if the string doesn't exist, make one up then run drawfloor() (also, save it for next time)
		var subj;
		for (var x=0; x<=14; x++) {
			floor[x]=[];     
			for (var y=0; y<=14; y++) {
				var colour=Math.floor((Math.random()*4)+0);
				floor[x][y]=colour;
			}
		}
		saveFloor();
		drawFloor();
	}
}
//save the colours of the floor in a JSON string
function saveFloor(){
	var fl={};
	for(var d=0;d<floor.length;d++){
		fl[d]=floor[d];
	}
	localStorage.floor=JSON.stringify(fl);
}
function drawFloor(){
	//save the size of the floor for doing the side bits
	var end={x:floor.length-1,y:floor[0].length-1};
	//arrays for the side bits
	var sideX=[];
	var sideY=[];
	for(var x=0; x<floor.length;x++){
		things[x]=[];
		var subj=floor[x];
		matrix[x]=[];
		for(var y=0; y<subj.length;y++){
			things[x][y]=0;
			matrix[x][y]=basesheet = new sheetengine.BaseSheet({x:offset+x*45,y:offset+y*45,z:0}, {alphaD:90,betaD:0,gammaD:0}, {w:45,h:45});
			matrix[x][y].color = colours[subj[y]];
			matrix[x][y].dim = {x:x,y:y};
			if(x==end.x){
				sideX[y]= new sheetengine.BaseSheet({x:offset-8+(x+1)*45,y:offset+15+y*45,z:0}, {alphaD:90,betaD:0,gammaD:90}, {w:20,h:45});
				sideX[y].color = colours2[subj[y]];
			}
			if(y==end.y){
				sideY[x]= new sheetengine.BaseSheet({x:offset+14+(x)*45,y:offset-8+(y+1)*45,z:0}, {alphaD:0,betaD:90,gammaD:0}, {w:20,h:45});

				sideY[x].color = colours3[subj[y]];
			}
		}
	}

}
function _update(){ // draw the scene
	updateStats();
	sheetengine.calc.calculateAllSheets();
	sheetengine.drawing.drawScene(true);
}
//changes a square colour both physically and in localStorage
function changeSquare(square,colour){
	floor[square.x][square.y]=colour;
	saveFloor();
	matrix[square.x][square.y].color=colours[colour];
	_update();
}
//key handlers
document.onkeydown = checkKey;
document.onkeyup = ent;
// movement keys
function checkKey(e) {
	e = e || window.event;
	if (e.keyCode == '37') {//left
		me.tryMove(0);
	}else if (e.keyCode == '38') {// up arrow
		me.tryMove(1);
	}
	else if (e.keyCode == '39') {//right
		me.tryMove(2);
	}
	else if (e.keyCode == '40') {// down arrow
		me.tryMove(3);
	}else{
		return true;
	}
	return false;
}
//Close open modal with esc or enter
function ent(event) {
	if ((event.which == 13 || event.keyCode == 13)||(event.keyCode == 27 || event.which == 27)) {
		if(document.getElementById('modal').style.display !== 'none'){
			modal();
		}else{
			return true;
		}
		return false;
	}
	return true;
};
