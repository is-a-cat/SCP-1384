var currentSongN=0;
var tracks=[];
var isPlaying=false;
var vol=1;
function labelHandler(){
	var subj=document.getElementById('innerScroll');
	if(isPlaying){
		subj.innerHTML=""+songs[currentSongN].name+" by "+songs[currentSongN].auth;
	}else{
		subj.innerHTML='Nothing Playing. . .';
	}
}
function loadTracks(){
	for(var i=0;i<songs.length;i++){
		tracks[i]=new Audio('sound/'+songs[i].file+'.mp3');
	}
}
var currentSong=tracks[currentSongN];
function rewind(){
	tracks[currentSongN].currentTime = 0;
}
function skipSong(){
	if(songs[currentSongN+1]){
		var target=currentSongN+1;
	}else{
		var target=0;
	}
	playSong(target);
}
function stopSong(){
	if(isPlaying){
		rollover('Song stopped',50);
		currentSong.pause();
		currentSong=document.getElementById(songs[0]);
		isPlaying=false;
		localStorage.audio=false;
		document.getElementById('switch3').checked=false;
	}
	labelHandler();
}
//var volMin=document.getElementById('volMinus').disabled;
//var volPlus=document.getElementById('volPlus').disabled;
function volChange(n){
	vol=(n==1&&vol<1?vol+=0.1:vol);
	vol=(n!=1&&vol>0?vol-=0.1:vol);
	document.getElementById('volumeBar').style.width = vol*100;
	//	document.getElementById('volPlus').disabled=(vol>=0.91?true:false);
	//	document.getElementById('volMinus').disabled=(vol<=0.01?true:false)
	if(currentSong)
		currentSong.volume=vol;
}
function playSong(n){
	localStorage.audio=true;
	if(isPlaying){
		currentSong.pause();
	}else{
		isPlaying = true;
	}
	if(!n){
		n=0;
	}	
	rollover(songs[n].name+" by "+songs[n].auth,50);
	currentSongN=n;
	tracks[n].addEventListener('ended', function(){
		this.currentTime = 0;
		if(songs[n+1])
			playSong(n+1)
		else
			playSong(0);
	}, false);
	currentSong=tracks[n];
	tracks[n].play();
	tracks[n].volume=vol;
	labelHandler();
}

