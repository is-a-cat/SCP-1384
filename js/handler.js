var debug=(window.location.hash=='#debug'?1:0);
var first = ((!localStorage.player)||(localStorage.player=="0,12"&&localStorage.scp=="14,6")?1:0);
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

//var count=0;
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
	document.getElementById('Bplus').innerHTML='-'
}else{
	document.getElementById('Bplus').innerHTML='+'
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
	    || document.webkitCancelFullScreen
    ;
    if(is)
	    cfs.call(document);
    else
	    rfs.call(el);
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
	console.log(stat);

}
function saveText(){

	rollover('Text saved',20);
	localStorage.notes=document.getElementById('notes').value;
}
function dim() {
	var e = document.getElementById('dimmer');
	if(e.style.display !== 'none'){
		e.style.display = 'none';
		e.style.zIndex = '0';
	}else{

		e.style.display = 'block';
		e.style.zIndex = '10';
	}
}
function toggle_visibility(id) {
	var e = document.getElementById(id);
	if(e.style.display !== 'none')
		e.style.display = 'none';
	else
		e.style.display = 'block';
}
function modal(){
	document.getElementById("everything").className=0;
	toggle_visibility('modal');
	dim();
}
function newGame(auto){
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
				var colour=Math.floor((Math.random()*4)+0);
				floor[x][y]=colour;
			}
		}
		saveFloor();
		drawFloor();
	}
}
function saveFloor(){
	var fl={};
	for(var d=0;d<floor.length;d++){
		fl[d]=floor[d];
	}
	localStorage.floor=JSON.stringify(fl);
}
function drawFloor(){
	for(var x=0; x<floor.length;x++){
		things[x]=[];
		var subj=floor[x];
		matrix[x]=[];
		for(var y=0; y<subj.length;y++){
			things[x][y]=0;
			matrix[x][y]=basesheet = new sheetengine.BaseSheet({x:offset+x*45,y:offset+y*45,z:0}, {alphaD:90,betaD:0,gammaD:0}, {w:45,h:45});
			//matrix[x][y].color = floor[x][y];
			matrix[x][y].color = colours[subj[y]];
			matrix[x][y].dim = {x:x,y:y};
		}
	}

}
function _update(){ // draw the scene
	updateStats();
	sheetengine.calc.calculateAllSheets();
	sheetengine.drawing.drawScene(true);
}
function changeSquare(square,colour){
	console.log("changing square from "+colours[floor[square.x][square.y]]+" to "+colours[colour]);
	floor[square.x][square.y]=colour;
	saveFloor();
	matrix[square.x][square.y].color=colours[colour];
	_update();
}
document.onkeydown = checkKey;
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
