function smileAmount(landmarks, latents) {
    var latentsOffset = 0;
    var indicator = 0.0;
    if (latents[latentsOffset + 1] > 0 && latents[latentsOffset + 5] > 0) {
        indicator = Math.min(0.14 * latents[latentsOffset + 1] * latents[latentsOffset + 5], 1);
    }
    return indicator;
}

let isPlaying = true;
function Effect() {
    var self = this;
    var Timer;
    var Delay = 3500;
    //var smileCoeff = 0.1;

    this.meshes = [
		{ file:"Gangster.bsm2", anims:[
			{ a:"idle", t:33.3333 },
			{ a:"fire", t:3333.33 },
		] },
	];

    this.play = function () {
        var now = (new Date()).getTime();        
        if (now > Timer && Api.isMouthOpen()) {
            Api.hideHint();
            Api.meshfxMsg("animOnce", 1, 0, "fire");            
            isPlaying && Api.playSound("gun_sfx.ogg", false, 1);                    
            Timer = now + Delay;
        }
    };

    this.init = function () {
        Timer = 0;
        Api.meshfxMsg("spawn", 2, 0, "!glfx_FACE");
        Api.meshfxMsg("spawn", 0, 0, "Beauty06.bsm2");
        Api.meshfxMsg("spawn", 1, 0, "Gangster.bsm2");        

        self.faceActions = [self.play];
        // Api.showHint("Open mouth");
        // Api.playVideo("frx",true,1); 
        isPlaying ** Api.playSound("music.ogg", true, 1);
        Api.showRecordButton();
    };

    this.restart = function () {
        Api.meshfxReset();
        Api.stopSound("music.ogg");
        Api.stopSound("gun_sfx.ogg");
        self.init();
    };

    this.faceActions = [];
    this.noFaceActions = [];

    this.videoRecordStartActions = [];
    this.videoRecordFinishActions = [];
    this.videoRecordDiscardActions = [this.restart];
}

configure(new Effect());

function stopMusic(){
    isPlaying = false;
    Api.stopSound("music.ogg");
    Api.stopSound("gun_sfx.ogg");
}

function GetMouthStatus(){
    return Api.isMouthOpen();
}
const B = require("bnb_js/background");
B.texture("images/BG_plain.png")
