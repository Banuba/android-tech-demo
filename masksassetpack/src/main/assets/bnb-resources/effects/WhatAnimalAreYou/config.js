let isInteractive = true;

var isButtonTouched = false;

var isTextureChanged = false;

var cloverCollisionSize = 0.3;

var animationTime = 4000; // Time in ms, when anim play
var animationStep = 60; // Base step between textures change

var startAnimSlowDown = 2.; // increases animation step in the first 20% of Animation time
var endAnimSlowDown = 3.; // increases animation step in the last 20% of Animation time

var playFieldCenter = { // button position for Collider function. Need to be UPDATED in gui_quad_L1.vert, line 38 if changed
	x: 0.0,
    y: -0.4
};

var playFieldOffset = {
	x: 0.15,
	y: 0.0
};

var animalsTextures = [
	["bear_1.png","bear_ears.png","bear_nose.png"],
	["beaver_1.png","beaver_ears.png","beaver_nose.png"],
	["cat_1.png","cat_ears.png","cat_nose.png"],
	["cat2_1.png","cat_2_ears.png","cat_2_nose.png"],
	["dog_1.png","dog_ears.png","dog_nose.png"],
	["fox_1.png","fox_ears.png","fox_nose.png"],
	["hedgehog_1.png","hedgehog_ears.png","hedgehog_nose.png"],
	["lemur_1.png","lemur_ears.png","lemur_nose.png"],
	["monkey_1.png","monkey_ears.png","monkey_nose.png"],
	["panda_1.png","panda_ears.png","panda_nose.png"],
	["pig_1.png","pig_ears.png","pig_nose.png"],
	["sloth_1.png","sloth_ears.png","sloth_nose.png"],
	["squirell_1.png","squirrel_ears.png","squirrel_nose.png"]
];

var i = 0;

function randomAnimals(delay, step){
	var timer = new Date().getTime();
	var step1 = step * startAnimSlowDown;
	var step2 = step * endAnimSlowDown;

	effect.faceActions.push(changeTexture);
	effect.noFaceActions.push(changeTexture);
	Api.print("Textures Spawned");
	
	function changeTexture(){
		var now = new Date().getTime();
		var diff = now - timer;
		if (diff < delay){
			if((diff > 0) && (diff <= delay * 0.2) && !isTextureChanged){
				isTextureChanged = true;
				timeOut(step1, function(){
					spawnTexture();
					Api.print("Period 111111");
				});
			} else if ((diff > delay * 0.2) && (diff <= delay * 0.8) && !isTextureChanged){
				isTextureChanged = true;
				timeOut(step, function(){
					spawnTexture();
					Api.print("Period 222222");
				});
			} else if (diff > (delay * 0.8) && (diff < delay) && !isTextureChanged){
				isTextureChanged = true;
				timeOut(step2, function(){
					spawnTexture();
					Api.print("Period 3333333");
				});
			} 
		} else {
			var idx = effect.faceActions.indexOf(changeTexture);
			effect.faceActions.splice(idx, 1);
			idx = effect.noFaceActions.indexOf(changeTexture);
			effect.noFaceActions.splice(idx, 1);

			timeOut(step*6., function(){
				Api.meshfxMsg("spawn", 3, 0, "quad_L1.bsm2");
				Api.meshfxMsg("tex", 3, 0, "btn_restart.png");
				timeOut(2000, function(){Api.meshfxMsg("del", 2);});
				isButtonTouched = false;
				Api.meshfxMsg("spawn", 5, 0, "Planes.bsm2");
				Api.meshfxMsg("tex", 5, 1, animalsTextures[i][2]);
				Api.meshfxMsg("tex", 5, 0, animalsTextures[i][1]);
				Api.print("Restart SPAWNED");
			});
		}
	}
}

function Effect() {
	var self = this;

	this.init = function() {
		Api.meshfxMsg("spawn", 1, 0, "!glfx_FACE");

		Api.meshfxMsg("spawn", 0, 0, "Morph.bsm2");

		Api.meshfxMsg("spawn", 5, 0, "Planes.bsm2");
		// Api.meshfxMsg("tex", 5, 1, animalsTextures[i][2]);
		// Api.meshfxMsg("tex", 5, 0, animalsTextures[i][1]);

		Api.meshfxMsg("spawn", 3, 0, "quad_L1.bsm2");
		Api.meshfxMsg("tex", 3, 0, "btn_start.png");

		isInteractive && Api.meshfxMsg("spawn", 4, 0, "plane2.bsm2");

		Api.playVideo("frx", true, 1);
		timeOut(3000, function(){
			Api.meshfxMsg("del", 4);
		});
		// randomAnimals(animationTime,animationStep);
		Api.showRecordButton();
	};

	this.delVideo = function() {
		Api.meshfxMsg("del", 4);
	};

	this.delButton = function() {
		Api.meshfxMsg("del", 3);
	};

	this.spawnRestart = function(){
		Api.meshfxMsg("spawn", 3, 0, "quad_L1.bsm2");
		Api.meshfxMsg("tex", 3, 0, "btn_restart.png");
		isButtonTouched = false;
	};

	this.restart = function() {
		Api.meshfxReset();
		self.init();
	};

	this.faceActions = [];
	this.noFaceActions = [];

	this.videoRecordStartActions = [this.delButton,this.delVideo];
	this.videoRecordFinishActions = [this.spawnRestart];
	this.videoRecordDiscardActions = [this.restart];
}

function onTakePhotoStart(){
	Api.meshfxMsg("del", 4);
	Api.meshfxMsg("del", 3);
};

function randInt(min, max) {
	// return Math.round(min - 0.5 + Math.random() * (max - min + 1.));
	min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function spawnTexture(){
		i = randInt(0,12);
		Api.meshfxMsg("del", 2);
		Api.meshfxMsg("spawn", 2, 0, "plane.bsm2");
		Api.meshfxMsg("tex", 2, 0, animalsTextures[i][0]);
		isTextureChanged = false;
}

configure(new Effect());

function timeOut(delay, callback) {
	var timer = new Date().getTime();

	effect.faceActions.push(removeAfterTimeOut);
	effect.noFaceActions.push(removeAfterTimeOut);

	function removeAfterTimeOut() {
		var now = new Date().getTime();

		if (now >= timer + delay) {
			var idx = effect.faceActions.indexOf(removeAfterTimeOut);
			effect.faceActions.splice(idx, 1);
			idx = effect.noFaceActions.indexOf(removeAfterTimeOut);
			effect.noFaceActions.splice(idx, 1);
			callback();
		}
	}
}

function getCloverPos(x, y) {
	var pos = {};
	switch (x) {
		case 0:
			pos.x = playFieldCenter.x - playFieldOffset.x;
			break;
		case 1:
			pos.x = playFieldCenter.x;
			break;
		case 2:
			pos.x = playFieldCenter.x + playFieldOffset.x;
			break;
	}
	switch (y) {
		case 0:
			pos.y = playFieldCenter.y + playFieldOffset.y;
			break;
		case 1:
			pos.y = playFieldCenter.y;
			break;
		case 2:
			pos.y = playFieldCenter.y - playFieldOffset.y;
			break;
	}
	return pos;
}

function collisionCheck(pointX, pointY, targetX, targetY, size) {
	if (pointX > targetX - size) {
		if (pointX < targetX + size) {
			if (pointY > targetY - size) {
				if (pointY < targetY + size) return true;
			}
		}
	}
	return false;
}

function onTouchesBegan(touches) {
	if(isInteractive) {
		Api.meshfxMsg("del", 4);
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				var pos = getCloverPos(i, j);
				if (collisionCheck(touches[0].x, touches[0].y * 1.5, pos.x, pos.y, cloverCollisionSize) && !isButtonTouched) {
					isButtonTouched = true;
					Api.print('You touched:' + pos.x + ', ' + pos.y);
					Api.meshfxMsg("del", 3);
					randomAnimals(animationTime,animationStep);
					return;
				}
			}
		}
	}
}

function hideInteractive(){
    isInteractive = false;
    Api.hideHint();
	Api.meshfxMsg("del", 4);
}