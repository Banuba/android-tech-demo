var settings = {
    effectName: "Spider2"
};

let isPlaying = true;

var randOrder = Math.round(Math.random());

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
        'Effect Action': 'NoTrig', // or 'Swipe'
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

function Effect() {
    var self = this;

    this.meshes = [
        { file: "cut.bsm2", anims: [
            { a: "Take 001", t: 3333 },
        ] },
        { file: "morph.bsm2", anims: [
            { a: "static", t: 0 },
        ] },
        { file: "spider_animation.bsm2", anims: [
            { a: "spider_rig|spider_jump_animation", t: 9300 },
            { a: "spider_rig|spider_walk_animation", t: 10766 },
        ] },
    ];

    this.init = function() {
        Api.meshfxMsg("spawn", 3, 0, "!glfx_FACE");

        Api.meshfxMsg("spawn", 0, 0, "cut.bsm2");
        // Api.meshfxMsg("animOnce", 0, 0, "Take 001");

        Api.meshfxMsg("spawn", 1, 0, "morph.bsm2");
        // Api.meshfxMsg("animOnce", 1, 0, "static");

        Api.meshfxMsg("spawn", 2, 0, "spider_animation.bsm2");

        Api.meshfxMsg("spawn", 4, 0, "tri.bsm2");

        playRandomFirst();
        isPlaying && Api.playSound("music.ogg", true, 1);
        // Api.showHint("Open mouth");

        // Api.playVideo('frx',true,1);
        Api.showRecordButton();
    };

    this.restart = function() {
        Api.meshfxReset();
        Api.stopSound("music.ogg");
        self.init();
    };
    
    this.faceActions = [];
    this.noFaceActions = [];

    this.videoRecordStartActions = [];
    this.videoRecordFinishActions = [];
    this.videoRecordDiscardActions = [this.restart];
}

configure(new Effect());



function playRandomFirst(params) {
    Api.print(randOrder);
    var randUVx = Math.round(Math.random());
    var randUVy = Math.round(Math.random());

        Api.meshfxMsg("shaderVec4", 0, 0, randUVx + " " + randUVy + " 0 0");

        timeOut(18066, function(){Api.playVideo('frx',false,1);});

        isPlaying && Api.playSound("sfx_walk.ogg", false, 1);
        timeOut(10766, function(){isPlaying && Api.playSound("sfx_jump.ogg", false, 1);});

        Api.meshfxMsg("animOnce", 2, 0, "spider_rig|spider_walk_animation");
        Api.meshfxMsg("animOnce", 2, 1, "spider_rig|spider_jump_animation");

    timeOut(20066, function(){playRandomFirst()});
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

function stopMusic(){
    isPlaying = false;
    Api.stopSound("sfx_walk.ogg");
    Api.stopSound("sfx_jump.ogg");
    Api.stopSound("music.ogg");
}