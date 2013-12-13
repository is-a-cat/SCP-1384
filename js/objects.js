function SCP(position){
	this.x = position.x;
	this.y = position.y;
	if(floor[this.x][this.y]==1){
		changeSquare({x:this.x,y:this.y},2);	
	}
	this.type='scp';
	this.been=[];
	things[this.x][this.y]=this;
	var pos=matrix[this.x][this.y].centerp;
	//-------DEFINING IMAGE
	this.shadow = new sheetengine.Sheet(
		{
		x: -82,
		y: -40,
		z: -30
	},
	{
		alphaD: 90,
		betaD: 90,
		gammaD: 0
	},
	{
		w: 30,
		h: 64
	});
	var radgrad = this.shadow.context.createLinearGradient(0,64,0,0);
	radgrad.addColorStop(0, 'rgba(0,0,0,.1)');
	radgrad.addColorStop(0.8, 'rgba(0,0,0,0)');
	this.shadow.context.fillStyle = radgrad;
	this.shadow.context.fillRect(0, 0, 30, 64);
	this.shadow.setShadows(false, false);
	//-------------
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
	}, [this.sheet,this.shadow],
	{
		w: 100,
		h: 64,
		relu: 0,
		relv: 0
	});

	this.obj.setShadows(false, false);
	this.sheet.context.fillStyle = '#12FF00';
	this.sheet.context.fillRect(0, 0, 30, 64);
}
SCP.prototype.isFree = function(x,y,d){
	if(x===0&&(y===10||y===14)){
		return false;
	}
	if(matrix[x]){
		if(!matrix[x][y])
			return false;
	}else{
		return false;
	}
	if(this.been[1]){//just come from that square
		if(this.been[1].x===x&&this.been[1].y===y){//don't move back to where you just where.
			if(!d)
			return false;
		}
	}
	if(floor[x]){//square is yellow
		if(floor[x][y]==1){//square is yellow
			return false;
		}
	}
	if(things[x]){
		if(things[x][y]!=0){//square is occupied
			return false;
		}
	}
	return true;
}
var mov = [ {x:-1,y:0}, {x:0,y:-1}, {x:1,y:0}, {x:0,y:1}];
SCP.prototype.tryMove = function(){
	//check distance, if far, try forward.
	if( (this.y==11||this.y==12||this.y==13) && this.x==0){
		alert('You Lose');
		newGame(1);
		return;
	}
	if( ( this.isFree( this.x+mov[0].x,this.y+mov[0].y ) )&&(this.x>4) ){
		var dir=mov[0];	
		//forward
	}else{
		//if close, see which direction to move.
		if(( this.y<11 )&&( this.isFree( this.x+mov[3].x,this.y+mov[3].y ) )){
			var dir=mov[3];	
		}else if(( this.y>13 )&&( this.isFree( this.x+mov[1].x,this.y+mov[1].y ) )){
			var dir=mov[1];	
		}else if(( this.isFree( this.x+mov[0].x,this.y+mov[0].y ) )){
			var dir=mov[0];	
		}else if(( this.y>=13 )&&( this.isFree( this.x+mov[1].x,this.y+mov[1].y ) )){
			var dir=mov[1];	
		}else if(( this.y<=11 )&&( this.isFree( this.x+mov[3].x,this.y+mov[3].y ) )){
			var dir=mov[3]; 
		}else if(( this.isFree( this.x+mov[1].x,this.y+mov[1].y ) )){
			var dir=mov[1];	
		}else if(( this.isFree( this.x+mov[3].x,this.y+mov[3].y ) )){
			var dir=mov[3]; 
		}else if( this.isFree( this.x+mov[1].x,this.y+mov[1].y,1 )&&( this.x==1&&this.y==14 )){//annoying one at the end
			var dir=mov[1];
		}else if( this.isFree( this.x+mov[2].x,this.y+mov[2].y,1 )&&( this.x==0&&this.y==9 )){//annoying one at the end
			var dir=mov[2];
		}else if(this.isFree( this.been[1].x,this.been[1].y,1 )&&things[this.x+mov[0].x][this.y+mov[0].y].type=='cube'){
			var dir={x:this.been[1].x,y:this.been[1].y};
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
	flash();
	localStorage.scp=[direction.x,direction.y].join(',');
	var dir=matrix[direction.x][direction.y].centerp;
	this.x+=newDir.x;
	this.y+=newDir.y;
	this.obj.setPosition(dir);
	_update();
}

function player(position){
	things[position.x][position.y]=this;
	this.x=position.x;
	this.y=position.y;
	this.type='player'
	this.been=[];
	var pos=matrix[this.x][this.y].centerp;
	this.shadow = new sheetengine.Sheet(
		{
		x: -72,
		y: -40,
		z: -30
	},
	{
		alphaD: 90,
		betaD: 90,
		gammaD: 0
	},
	{
		w: 30,
		h: 64
	});
	var radgrad = this.shadow.context.createLinearGradient(0,64,0,0);
	radgrad.addColorStop(0, 'rgba(0,0,0,.1)');
	radgrad.addColorStop(0.8, 'rgba(0,0,0,0)');
	this.shadow.context.fillStyle = radgrad;
	this.shadow.context.fillRect(0, 0, 30, 64);
	this.shadow.setShadows(false, false);
	//-------------
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
	}, [this.sheet, this.shadow],
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

	if(this.x==0&&(this.y==11||this.y==12||this.y==13)){
		if(dir==0){
			newGame();
			return;
		}
	}
	var oldGrid = {x:this.x, y:this.y};
	var newGrid = {x:this.x+mov[dir].x,y:this.y+mov[dir].y};
	function canMove(place){
		if(place.x===0&&(place.y===10||place.y===14)){ //Arches
			return false;
		}
		if(!matrix[place.x]||!matrix[place.x][place.y]){ //if square doesn't exist
			return false;
		}
		if(things[place.x][place.y]!=0){//if square is occupied
			return false;
		}
		return true; //if criteria is met
	}
	if(canMove(newGrid)){
		var cMov=0;
		var forw=0;
		if(( this.x==scp.x-1&&this.y==scp.y )&&dir==1){ //if crossing shadow and moving clockwise
			cMov++;
		}
		if(this.been[1]){
			if((newGrid.x==this.been[1].x)&&(newGrid.y==this.been[1].y)){//if moving backwards
				cMov++;
				forw=1;
			}
		}
		if(this.been[0]){
			if(this.been[0].c==floor[newGrid.x][newGrid.y]){//if moving to the same coloured square
				if(forw!=1)
				cMov++;
			}
		}
		this.been.unshift({x:newGrid.x,y:newGrid.y,c:floor[newGrid.x][newGrid.y]});//keep a record of movement
		things[oldGrid.x][oldGrid.y]=0;
		things[newGrid.x][newGrid.y]=this;
		 if(debug){//Show where the player has been
			for(var i=0;i<me.been.length;i++){ 
				matrix[me.been[i].x][me.been[i].y].color='pink';
			};
			_update();
		 }
		this.drawImg(2, [0,2,3,1][dir]);
		this.move(newGrid);
		if(cMov!=0){
			scp.tryMove();
		}
	}else{
		scp.tryMove(); // if the player cannot move, move the SCP
	}
}
player.prototype.move = function(dir){
	localStorage.player=[dir.x,dir.y].join(',');
	var coords=matrix[dir.x][dir.y].centerp;
	this.x=dir.x;
	this.y=dir.y;
	this.obj.setPosition({ x: coords.x, y: coords.y, z:0 });
	_update();
}
function arch(){
	var pos=matrix[0][14].centerp;
	this.sheet = new sheetengine.Sheet(
		{
		x: -145,
		y: -207,
		z: 0
	},
	{
		alphaD: 0,
		betaD: 0,
		gammaD: 45
	},
	{
		w: 169,
		h: 266
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
		w: 169,
		h: 266,
		relu: 20,
		relv: 50
	});
	//169 266
	this.obj.setShadows(false, false);
	this.img = new Image();
	this.img.src = 'img/exit.png';
	var that = this;
	 this.img.onload = function ()
	 {
		 that.sheet.context.clearRect(0, 0, 169, 266);
		 that.sheet.context.drawImage(that.img,0,0);
		 that.sheet.canvasChanged();
		 _update();
	 };
	this.sheet.canvasChanged();
	_update();
}
function cube(position,rot,col){
	this.x=position.x;
	this.y=position.y;
	this.type='cube';
	things[this.x][this.y]=this;
	var pos=matrix[this.x][this.y].centerp;
	this.sheet = new sheetengine.Sheet(
		{
		x: 0,
		y: 0,
		z: 0
	},
	{
		alphaD: 0,
		betaD: 0,
		gammaD: 0
	},
	{
		w: 35,
		h: 35
	});
	this.sheet2 = new sheetengine.Sheet(
		{
		x: 17,	
		y: -17,	
		z: 0
	},
	{
		alphaD: 0,
		betaD: 0,
		gammaD: 90
	},
	{
		w: 35,
		h: 35
	});
	this.sheet3 = new sheetengine.Sheet(
		{
		x: 0,	
		y: -17,	
		z: 17
	},
	{
		alphaD: 90,
		betaD: 0,
		gammaD: 0
	},
	{
		w: 35,
		h: 35
	});
	this.sheet.context.fillStyle = colours3[col];
	this.sheet.context.fillRect(0, 0, 35, 35);
	this.sheet2.context.fillStyle = colours4[col];
	this.sheet2.context.fillRect(0, 0, 35, 35);
	this.sheet3.context.fillStyle = colours[col];
	this.sheet3.context.fillRect(0, 0, 35, 35);
	this.obj = new sheetengine.SheetObject(
		{
		x: pos.x-20,
		y: pos.y-11,
		z: 0
	},
	{
		alphaD: 0,
		betaD: 0,
		gammaD: rot 
	}, [this.sheet,this.sheet2,this.sheet3],
	{
		w: 35,
		h: 35,
		relu: 20,
		relv: 50
	});
	this.sheet.setShadows(false, true);
	this.sheet2.setShadows(false, true);
	this.sheet3.setShadows(false, true);
	_update();
}
