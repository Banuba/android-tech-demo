let isPlaying = true
function Effect() {
    var self = this;

    var timer = new Date().getTime();
    var delay = 3000;

    this.hideHint = function() {
        var now = new Date().getTime();

        if (now >= timer + delay) {
            Api.hideHint();
            var index = self.faceActions.indexOf(self.hideHint);
            self.faceActions.splice(index, 1);
        }
    };

    this.meshes = [
        { file: "BullfighterBeard.bsm2", anims: [
            { a: "Take 001", t: 10000 },
        ] },
        { file: "Cut.bsm2", anims: [
            { a: "Take 001", t: 10000 },
        ] },
        { file: "Hat.bsm2", anims: [
            { a: "Take 001", t: 10000 },
        ] },
        { file: "Shadow.bsm2", anims: [
            { a: "Take 001", t: 10000 },
        ] },
        { file: "face.bsm2", anims: [
            { a: "Take 001", t: 10000 },
        ] },
    ];

    this.play = function() {
       

        // if(Api.isMouthOpen()) {
        //  Api.hideHint();
        // }
    };

    this.init = function() {
        Api.meshfxMsg("spawn", 5, 0, "!glfx_FACE");

        Api.meshfxMsg("spawn", 0, 0, "BullfighterBeard.bsm2");
        // Api.meshfxMsg("animOnce", 0, 0, "Take 001");

        Api.meshfxMsg("spawn", 1, 0, "Cut.bsm2");
        // Api.meshfxMsg("animOnce", 1, 0, "Take 001");

        Api.meshfxMsg("spawn", 2, 0, "Hat.bsm2");
        // Api.meshfxMsg("animOnce", 2, 0, "Take 001");

        Api.meshfxMsg("spawn", 3, 0, "Shadow.bsm2");
        // Api.meshfxMsg("animOnce", 3, 0, "Take 001");

        Api.meshfxMsg("spawn", 4, 0, "face.bsm2");
        // Api.meshfxMsg("animOnce", 4, 0, "Take 001");

        for(var i = 0; i < self.meshes.length; i++) {
            self.meshes[i].animIdx = -1;
            self.meshes[i].endTime = 0;
        }

        self.faceActions = [self.play];
        // Enable background audio playback
        isPlaying && Api.playSound("music.ogg", true, 1);
        // Api.showHint("Open mouth");
        
        self.faceActions.push(self.hideHint);

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

function stopMusic(){
    isPlaying = false;
    Api.stopSound("music.ogg");

}