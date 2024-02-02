var isButtonTouched = false;

var isTextureChanged = false;

var cloverCollisionSize = 0.8;

var animationTime = 4000; // Time in ms, when anim play
var animationStep = 60; // Base step between textures change

var startAnimSlowDown = 1.5; // increases animation step in the first 20% of Animation time
var endAnimSlowDown = 2.5; // increases animation step in the last 20% of Animation time

var settings = {
    effectName: "WhatBunnyAreYou"
};

var spendTime = 0;

var analytic = {
    spendTimeSec: 0,
    taps: 0
};

function sendAnalyticsData() {
    var _analytic;
    analytic.spendTimeSec = Math.round(spendTime / 1000);
    _analytic = {
        'Event Name': 'Effects Stats',
        'Effect Name': settings.effectName,
        'Effect Action': 'Tap', // or 'Swipe'
        'Action Count': String(analytic.taps),
        'Spend Time': String(analytic.spendTimeSec)
    };
    Api.print('sended analytic: ' + JSON.stringify(_analytic));
    Api.effectEvent('analytic', _analytic);
}

function onStop() {
    try {
        sendAnalyticsData();
    } catch (err) {
        Api.print(err);
    }
}

function onFinish() {
    try {
        sendAnalyticsData();
    } catch (err) {
        Api.print(err);
    }
}

var playFieldCenter = { // button position for Collider function. Need to be UPDATED in gui_quad_L1.vert, line 38 if changed
	x: 0.0,
    y: 0.0
};

var playFieldOffset = {
	x: 0.4,
	y: 0.0
};

var effectData = {
    1: {model:"2d.bsm2",
        noseTexture: "rabbit_Base_Color_1.ktx",
        videoUVPos: [0.5,1./6.,0.,0.]},
    2: {model:"2d.bsm2",
        noseTexture: "rabbit_Base_Color_1.ktx",
        videoUVPos: [0.5,1./6.,0.,1./6.]},
    3: {model:"2d.bsm2",
        noseTexture: "rabbit_Base_Color_2.ktx",
        videoUVPos: [0.5,1./6.,0.,2./6.]},
    4: {model:"2d.bsm2",
        noseTexture: "null_image.png",
        videoUVPos: [0.5,1./6.,1.,1./6.]},
    5: {model:"2d.bsm2",
        noseTexture: "rabbit_Base_Color_1.ktx",
        videoUVPos: [0.5,1./6.,1.,4./6.]},
    6: {model:"Ears_v1.bsm2",
        noseTexture: "rabbit_Base_Color_3.png",
        videoUVPos: [0.5,1./6.,1.01,3./6.]},
    7: {model:"2d.bsm2",
        noseTexture: "rabbit_Base_Color_3.png",
        videoUVPos: [0.5,1./6.,0.,5./6.]},
    8: {model:"2d.bsm2",
        noseTexture: "rabbit_Base_Color_4.ktx",
        videoUVPos: [0.5,1./6.,1.,0.]},
    9: {model:"rabbit.bsm2",
        noseTexture: "rabbit_Base_Color_3.png",
        videoUVPos: [0.5,1./6.,1.,2./6.]},
    10: {model:"Ears_v1.bsm2",
        noseTexture: "rabbit_Base_Color_3.png",
        videoUVPos:  [0.495,1./6.,0.003,3./6.]},
    11: {model:"2d.bsm2",
        noseTexture: "rabbit_Base_Color_3.png",
        videoUVPos: [0.5,1./6.,0.,4./6.]}
};

var isSpawned = false;

function randomInt(min, max)
{
    return Math.round(min - 0.5 + Math.random() * (max - min + 1));
};

var x = 0;

function Effect() {
    var self = this;

    this.init = function() {
        Api.meshfxMsg("spawn", 2, 0, "!glfx_FACE");
        Api.meshfxMsg("spawn", 1, 0, "morph.bsm2");
        Api.meshfxMsg("warp", 1, 0);

        Api.meshfxMsg("spawn", 4, 0, "quad_L1.bsm2");

        Api.meshfxMsg("spawn", 6, 0, "plane.bsm2");

        timeOut(3000, function(){Api.meshfxMsg("del", 6);});

        // Api.playSound("music.ogg", true, 1);
        Api.playVideoRange("frx", 0, 1, 1, 1);

        // onTouchesBegan();

    };

    this.restart = function() {
        Api.meshfxReset();
        // Api.stopSound("music.ogg");
        self.init();
    };

    this.delTap = function() {
        Api.meshfxMsg("del", 6);
    };

    this.timeUpdate = function () { 
        if (self.lastTime === undefined) self.lastTime = (new Date()).getTime();
    
        var now = (new Date()).getTime();
        self.delta = now - self.lastTime;
        if (self.delta < 3000) { // dont count spend time if application is minimized
            spendTime += self.delta;
        }
        self.lastTime = now;
    };
    
    this.faceActions = [this.timeUpdate];
    this.noFaceActions = [this.timeUpdate];

    this.videoRecordStartActions = [this.delTap];
    this.videoRecordFinishActions = [];
    this.videoRecordDiscardActions = [this.restart];
}

function onTakePhotoStart(){
    Api.meshfxMsg("del", 6);
};

function onTouchesBegan(touches) {
    Api.stopVideo("frx");
    Api.playVideo("frx", true, 1);
    Api.meshfxMsg("del", 6);
    if (!isButtonTouched){
        isButtonTouched = true;
        analytic.taps++;
        Api.meshfxMsg("del", 4);
        randomAnimals(animationTime,animationStep);
    }
}

configure(new Effect());

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
					changeEars();
					// Api.print("Period 111111");
				});
			} else if ((diff > delay * 0.2) && (diff <= delay * 0.8) && !isTextureChanged){
				isTextureChanged = true;
				timeOut(step, function(){
					changeEars();
					// Api.print("Period 222222");
				});
			} else if (diff > (delay * 0.8) && (diff < delay) && !isTextureChanged){
				isTextureChanged = true;
				timeOut(step2, function(){
					changeEars();
					// Api.print("Period 3333333");
				});
			} 
		} else {
			var idx = effect.faceActions.indexOf(changeTexture);
			effect.faceActions.splice(idx, 1);
			idx = effect.noFaceActions.indexOf(changeTexture);
			effect.noFaceActions.splice(idx, 1);

			timeOut(step2, function(){
			// 	Api.meshfxMsg("spawn", 3, 0, "quad_L1.bsm2");
			// 	Api.meshfxMsg("tex", 3, 0, "btn_restart.png");
			// 	timeOut(2000, function(){Api.meshfxMsg("del", 2);});
				isButtonTouched = false;
			// 	Api.meshfxMsg("spawn", 5, 0, "Planes.bsm2");
			// 	Api.meshfxMsg("tex", 5, 1, animalsTextures[i][2]);
			// 	Api.meshfxMsg("tex", 5, 0, animalsTextures[i][1]);
			// 	Api.print("Restart SPAWNED");
			});
		}
	}
}

function changeEars(){
    x = randomInt(1,11);
    Api.meshfxMsg("warp", 1, 100);

    Api.meshfxMsg("del", 0);
    Api.meshfxMsg("del", 3);
    Api.meshfxMsg("del", 5);
    
    Api.meshfxMsg("shaderVec4", 0, 0,  effectData[x].videoUVPos[0] + " " + effectData[x].videoUVPos[1] + " " + effectData[x].videoUVPos[2] + " " + effectData[x].videoUVPos[3]);
    
    if(x == 4){
        Api.meshfxMsg("spawn", 0, 0, "2d.bsm2");
        Api.meshfxMsg("spawn", 3, 0, "mustache.bsm2");
        Api.meshfxMsg("tex", 0, 0, effectData[x].noseTexture);


    } else if (x == 6 || x == 9 || x == 10 ){
        Api.meshfxMsg("spawn", 0, 0, "2d_1.bsm2");
        Api.meshfxMsg("tex", 0, 0, effectData[x].noseTexture);
        Api.meshfxMsg("spawn", 5, 0, effectData[x].model);
    } else{
        Api.meshfxMsg("spawn", 0, 0, effectData[x].model);
        Api.meshfxMsg("tex", 0, 0, effectData[x].noseTexture);
    }
    isTextureChanged = false;
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