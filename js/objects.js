/*===================================
=====OBJECT DEFINITIONS==============
===================================*/
//----------SCP-1384---------------
// takes JSON x:x,y:y
    var eachh = [
    {
        x: -1,
        y: 1
    },
    {
        x: -1,
        y: 0
    },
    {
        x: -1,
        y: -1
    },
    {
        x: 0,
        y: 1
    },
    {
        x: 0,
        y: 0
    },
    {
        x: 0,
        y: -1
    },
    {
        x: 1,
        y: 1
    },
    {
        x: 1,
        y: 0
    },
    {
        x: 1,
        y: -1
    }];
function makeSCP(pos)
{
    var that = this;
    this.movementX=[1,2,3,4,5];
    this.movementY=[6,7,8,9,0];
    this.type = 'scp';
    this.tryMove = function ()
    {
        this.move(0);
    }
    //---------Get contents of surrounding squares;
    var dirC = [
    {
        x: -1,
        y: 0
    },
    {
        x: 0,
        y: -1
    },
    {
        x: 1,
        y: 0
    },
    {
        x: 0,
        y: -1
    }];


    function getNear(x, y)
    {
        var chr = {
            x: that.coords.x + 1,
            y: that.coords.y + 1
        };
        var subb = {
            x: chr.x + x,
            y: chr.y + y
        };
        return subb;
    }

    function reconfigure()
    {
        for (var i = 0; i < 9; i++)
        {
            var su = getNear(eachh[i].x, eachh[i].y);
	    if(matrix[su.x][su.y])
		    changeSquare(su, Number.random(0, 4));
        }
    }
    this.move = function (dir, tries)
    {
	    //ENDGAME CONDITIONS.
        if (this.coords.x == 0)
        {
            if (this.coords.y == 5 || this.coords.y == 6)
            {
                endGame();
                return;
            }
        }
        var tries = tries || 0;
        console.log(tries);
        if (tries > 2)
        {
            reconfigure();
            return;
        }
	if((this.movementX[0]===this.movementX[2])&&(this.movementX[1]===this.movementX[3])){
		if((this.movementY[0]===this.movementY[2])&&(this.movementY[1]===this.movementY[3])){
			console.log('loop');
			reconfigure();
			//this.move(dir);
			this.movementX.length=0;
			this.movementY.length=0;
			this.movementX=[6,7,8,9,0];
			this.movementY=[1,2,3,4,5];
			return;
		}
	}
        //------------Accessable via scp.move
        //get Coords of square to be moved into
        var movCoords = getNear(dirC[dir].x, dirC[dir].y);
        var oldCoords = this.coords;
        //decide where to move
        var newCoords = {
            x: oldCoords.x + xm[dir],
            y: oldCoords.y + ym[dir]
        }
        var toSay = ('<b>SCP-1384</b> moved one square ' + dirWord[dir] + '.');
        //if square is occupied
        var altDir = [1, 2, 0, 1, 3, 2];
	//if at left edge, move away;
	if (this.coords.y == 13){
		if(dir!=1){
			this.move(1);
			return;
		}
	}
        if (((this.coords.y == 0 && dir == 1)))
        {
            this.move(0, tries + 1);
            return;
        }
        if ((this.coords.x == 0 && dir == 0))
        {
            this.move(1, tries + 1);
            console.log("end of the line");
            return;
        }
        if ((things[movCoords.x][movCoords.y] != 0) || (floor[movCoords.x][movCoords.y] == 1))
        {
            console.log('cannot move here');
            if (dir == 0 || tries >= 1)
            {
                //try left or right
                if (ym[dir] > floor[0].length / 2)
                {
                    if (tries >= 1)
                    {
                        console.log('trying right after left');
                        this.move(3, tries + 1);
                    }
                    else
                    {
                        console.log('trying left');
                        this.move(1, tries + 1);
                    }
                    return;
                }
                else
                {
                    if (tries >= 1)
                    {
                        console.log('trying left after right');
                        this.move(1, tries + 1);
                    }
                    else
                    {
                        console.log('trying right');
                        this.move(3, tries + 1);
                    }
                    return;
                }
            }
            else
            {
                console.log('trying forward');
                this.move(0);
                return;
            }
        }
        things[oldCoords.x][oldCoords.y] = 0;
        say.site(toSay);
        things[newCoords.x][newCoords.y] = this;

        actuallyMove(newCoords);
    }

    function actuallyMove(coords)
    {
        //ANIMATION GOES HERE
	    //DOn't move automatically for 50 seconds
	checkTime=0;
	//save last pos to make sure its not stuck in a loop
        that.movementX.unshift(parseInt(coords.x));
        that.movementY.unshift(parseInt(coords.y));
	//movement
        that.obj.setPosition(matrix[coords.x][coords.y].centerp);
	//add to steps taken
        stats.movement += 1;
        menuHandler();
        that.coords = coords;
        localStorage.scpCoords = [coords.x, coords.y];
        endCheck()
        _update();
    }

    function endGame()
    {
        console.log('game has ended');
        newGame();
    }

    function endCheck()
    {
        //Check to see if over the end tiles;
    }
    this.sheet = new sheetengine.Sheet(
    {
        x: 0,
        y: 0,
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
        relu: 20,
        relv: 50
    });
    this.obj.setShadows(false, false);
    this.sheet.context.fillStyle = '#12FF00';
    this.sheet.context.fillRect(0, 0, 30, 64);
    _update();

}
//--------------RESEARCHER-----------------
// takes JSON x:x,y:y
function researcher(cor)
{
    //---------Get contents of surrounding squares;
    //function getNear(x,y){
    this.getNear = function (x, y)
    {
        var chr = {
            x: that.coords.x + 1,
            y: that.coords.y + 1
        };
        var subb = {
            x: chr.x + x,
            y: chr.y + y
        };
        return subb;
    }
    function isNear(){
	    for(var i=0;i<9;i++){
		    if(i!=4){
			    var sub=getNear(eachh[i].x,eachh[i].y);
			    if(things[sub.x-2][sub.y-2].type=='scp'){
				    //matrix[sub.x-1][sub.y-1].color='green';
				    checkTime=0;
			    }
			    _update();
			    //	    console.log(sub.x,sub.y,things[sub.x][sub.y]);
		    }
	    }
    };
    function getNear(x, y)
    {

        var chr = {
            x: that.coords.x + 1,
            y: that.coords.y + 1
        };
        var subb = {
            x: chr.x + x,
            y: chr.y + y
        };
        return subb;
    }
    this.type = 'res';
    this.colours = [];
    things[cor.x][cor.y] = this;
    this.coords = cor;
    var pos = gridToCoords(cor)
    var that = this;
    this.move = function (dir)
    {
        var aa = things[scp.coords.x][scp.coords.y];
        if (!aa)
        {
            things[scp.coords.x][scp.coords.y] = scp;
        }
        //Accessable via scp.move
        var oldCoords = this.coords;
        var newCoords = {
            x: oldCoords.x + xm[dir],
            y: oldCoords.y + ym[dir]
        }
        //			matrix[newCoords.x][newCoords.y].color='red';
        if (things[parseInt(newCoords.x - 1)][parseInt(newCoords.y - 1)] !== 0)
        {
            console.log('hit');
            if (things[newCoords.x - 1][newCoords.y - 1].type == 'scp')
            {
                scp.tryMove(0);
            }
            return;
        }
        things[oldCoords.x][oldCoords.y] = 0;
        this.drawImg(2, imgDir[dir]);
        things[newCoords.x][newCoords.y] = this;
        actuallyMove(newCoords);
    }

    function actuallyMove(coords)
    {
	    //if next to SCP, don't move for another 50 seconds
	    isNear();
        //ANIMATION GOES HERE
        that.colours.unshift(parseInt(floor[coords.x][coords.y]));
        if (that.colours[0] == that.colours[1])
        {
            scp.move(0);
        }
        var sub = matrix[coords.x][coords.y].centerp;
        that.obj.setPosition(
        {
            x: sub.x - 30,
            y: sub.y - 30,
            z: 0
        });
        localStorage.playerCoords = [coords.x, coords.y];
        that.coords = coords;
        _update();
    }

    function endCheck()
    {
        //Check to see if over the end tiles;
    }
    this.sheet = new sheetengine.Sheet(
    {
        x: 0,
        y: 0,
        z: 0
    },
    {
        alphaD: 0,
        betaD: 0,
        gammaD: 45
    },
    {
        w: 45,
        h: 60
    });
    this.obj = new sheetengine.SheetObject(
    {
        x: pos.x - 30,
        y: pos.y - 30,
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
    //this.sheet.context.fillStyle = 'red';
    //this.sheet.context.fillRect(0, 0, 30, 64);
    this.dim = {
        w: 46,
        h: 60,
        p: 0
    }
    this.img = new Image();
    this.img.src = 'img/sci.png';
    var aaa = this;
    this.img.onload = function ()
    {
        aaa.drawImg(2, 0)
    };
    this.drawImg = function (x, y)
    {
        var aaa = this;
        aaa.sheet.context.clearRect(0, 0, 45, 60);
        aaa.sheet.context.drawImage(aaa.img, (aaa.dim.w + aaa.dim.p) * x, (aaa.dim.h + aaa.dim.p) * y, aaa.dim.w, aaa.dim.h, 0, 0, aaa.dim.w, aaa.dim.h);
        aaa.sheet.canvasChanged();
        _update();
    }
    aaa.sheet.canvasChanged();
    _update();

}
//-----------ARCH
// Takes json x:x,y:y
function arch(pos)
{
    this.sheet = new sheetengine.Sheet(
    {
        x: 0,
        y: 0,
        z: 0
    },
    {
        alphaD: 0,
        betaD: 0,
        gammaD: 90
    },
    {
        w: 200,
        h: 80
    });
    this.obj = new sheetengine.SheetObject(
    {
        x: pos.x - 79,
        y: pos.y - 80,
        z: 0
    },
    {
        alphaD: 0,
        betaD: 0,
        gammaD: 0
    }, [this.sheet],
    {
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
