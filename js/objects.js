function SCP(position){
	this.x = position.x;
	this.y = position.y;
	this.type='scp';
	this.been=[];
	things[this.x][this.y]=this;
	var pos=matrix[this.x][this.y].centerp;
	//-------DEFINING IMAGE
	this.sheet = new sheetengine.Sheet(
		{
		x: -40,
		y: -40,
		z: 0
	},
	{
		alphaD: 0,
		betaD: 0,
		gammaD: 45
	},
	{
		w: 30,
		h: 64
	});
	this.obj = new sheetengine.SheetObject(
		{
		x: pos.x,
		y: pos.y,
		z: 0
	},
	{
		alphaD: 0,
		betaD: 0,
		gammaD: 0
	}, [this.sheet],
	{
		w: 100,
		h: 64,
		relu: 0,
		relv: 0
	});
	this.obj.setShadows(false, false);
	this.sheet.context.fillStyle = '#12FF00';
	this.sheet.context.fillRect(0, 0, 30, 64);
	_update();
}
SCP.prototype.isFree = function(x,y){
	if(this.been[1]){//just come from that square
		if(this.been[1].x===x&&this.been[1].y===y){//don't move back to where you just where.
			return false;
		}
	}
	if(floor[x][y]==1){//square is yellow
		return false;
	}else if(things[x][y]!=0){//square is occupied
		return false;
	}else{
		return true;
	}
}
var mov = [ {x:-1,y:0}, {x:0,y:-1}, {x:1,y:0}, {x:0,y:1}];
SCP.prototype.tryMove = function(){
	//check distance, if far, try forward.
	if( (this.y==6||this.y==7) && this.x==1){
		localStorage.clear();
		console.log("END");
	}
	if( ( this.isFree( this.x+mov[0].x,this.y+mov[0].y ) )&&(this.x>4) ){
		console.log("forward");
		var dir=mov[0];	
		//forward
	}else{
		//if close, see which direction to move.
		if(( this.y<6 )&&( this.isFree( this.x+mov[3].x,this.y+mov[3].y ) )){
			console.log('move left');
			var dir=mov[3];	
		}else if(( this.y>7 )&&( this.isFree( this.x+mov[1].x,this.y+mov[1].y ) )){
			console.log('move right');
			var dir=mov[1];	
		}else if(( this.isFree( this.x+mov[0].x,this.y+mov[0].y ) )){
			console.log('move forward');
			var dir=mov[0];	
		}else if(( this.y>=7 )&&( this.isFree( this.x+mov[1].x,this.y+mov[1].y ) )){
			console.log('move right');
			var dir=mov[1];	
		}else if(( this.y<=6 )&&( this.isFree( this.x+mov[3].x,this.y+mov[3].y ) )){
			console.log('move left');
			var dir=mov[3]; 
		}else if(( this.isFree( this.x+mov[1].x,this.y+mov[1].y ) )){
			console.log('move right');
			var dir=mov[1];	
		}else if(( this.isFree( this.x+mov[3].x,this.y+mov[3].y ) )){
			console.log('move left');
			var dir=mov[3]; 
		}else{
			for(var i=0;i<9;i++){
				var coords=[{x:0,y:1},{x:1,y:0},{x:1,y:1},{x:-1,y:0},{x:0,y:-1},{x:-1,y:-1},{x:-1,y:1},{x:1,y:-1}][i];
				var colour=Math.floor((Math.random()*4)+0);
				changeSquare({x:this.x+coords.x,y:this.y+coords.y},colour);
			}
			return;
			//change floor
		}
	}
	var oldCoords = {x:this.x,y:this.y};
	var newCoords = {x:this.x+dir.x,y:this.y+dir.y};
	things[oldCoords.x][oldCoords.y]=0;	
	things[newCoords.x][newCoords.y]=this;	
	this.been.unshift({x:newCoords.x,y:newCoords.y,c:floor[newCoords.x][newCoords.y]});//keep a record of movement
	var newDir=dir;
	this.move(newCoords,newDir);
}
SCP.prototype.move = function(direction,newDir){
	var dir=matrix[direction.x][direction.y].centerp;
	this.x+=newDir.x;
	this.y+=newDir.y;
	//console.log(this.x,this.y)
	this.obj.setPosition(dir);
	_update();
}

function player(position){
	this.x=position.x;
	this.y=position.y;
	this.type='player'
	this.been=[];
	var pos=matrix[this.x][this.y].centerp;
	this.sheet = new sheetengine.Sheet(
		{
		x: -26,
		y: -30,
		z: 0
	},
	{
		alphaD: 0,
		betaD: 0,
		gammaD: 45,
	},
	{
		w: 45,
		h: 60
	});
	this.obj = new sheetengine.SheetObject(
		{
		x: pos.x,
		y: pos.y,
		z: 0
	},
	{
		alphaD: 0,
		betaD: 0,
		gammaD: 0
	}, [this.sheet],
	{
		w: 45,
		h: 60,
		relu: 20,
		relv: 50
	});
	this.obj.setShadows(false, false);
	this.dim = {
		w: 46,
		h: 60,
		p: 0
	}
	this.img = new Image();
	this.img.src = 'img/sci.png';
	var that = this;
	this.img.onload = function ()
	{
		that.drawImg(2, 3)
	};
	this.sheet.canvasChanged();
	_update();

}
player.prototype.drawImg = function (x, y){
	this.sheet.context.clearRect(0, 0, 45, 60);
	this.sheet.context.drawImage(this.img, (this.dim.w + this.dim.p) * x, (this.dim.h + this.dim.p) * y, this.dim.w, this.dim.h, 0, 0, this.dim.w, this.dim.h);
	this.sheet.canvasChanged();
	_update();
}
player.prototype.tryMove = function (dir){
	var oldGrid = {x:this.x, y:this.y};
	var newGrid = {x:this.x+mov[dir].x,y:this.y+mov[dir].y};
	function canMove(place){
		if(!matrix[place.x][place.y]){
			return false;
		}
		if(things[place.x][place.y]==0){
			return true;
		}else if(things[place.x][place.y].type='scp'){
			scp.tryMove();
			return false;
		}
		return false;
	}
	if(canMove(newGrid)){
		if(this.been[1]){
			if((newGrid.x==this.been[1].x)&&(newGrid.y==this.been[1].y)){//if moving backwards
				scp.tryMove();
			}
		}
		if(this.been[0]){
			if(this.been[0].c==floor[newGrid.x][newGrid.y]){//if moving to the same coloured square
				scp.tryMove();
			}
		}
		this.been.unshift({x:newGrid.x,y:newGrid.y,c:floor[newGrid.x][newGrid.y]});//keep a record of movement
		things[oldGrid.x][oldGrid.y]=0;
		things[newGrid.x][newGrid.y]=this;

		/*	Show where player has been;
			for(var i=0;i<me.been.length;i++){ 
			matrix[me.been[i].x][me.been[i].y].color='red';
			};
			_update();
			*/
		this.drawImg(2, [0,2,3,1][dir]);
		this.move(newGrid);
	}else{
		console.log('nope');
	}
}
player.prototype.move = function(dir){
	var coords=matrix[dir.x][dir.y].centerp;
	this.x=dir.x;
	this.y=dir.y;
	this.obj.setPosition({ x: coords.x, y: coords.y, z:0 });
	_update();
}
