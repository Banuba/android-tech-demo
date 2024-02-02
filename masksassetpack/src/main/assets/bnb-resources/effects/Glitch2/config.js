function Effect()
{
    var self = this;
    var c = 0.5;
    var sec = 0;
    var lastFrame;

    this.play = function() {
        var now = (new Date()).getTime();
        sec += (now - lastFrame)/1000;
        Api.meshfxMsg("shaderVec4", 0, 0, String(sec));
        //Api.showHint(String(sec));
        lastFrame = now;
    }

    this.init = function() {
        lastFrame = (new Date()).getTime();
        
        Api.meshfxMsg("spawn", 0, 0, "quad.bsm2");
    };

    this.restart = function() {
        Api.meshfxReset();
        self.init();
    };

    this.faceActions = [this.play];
    this.noFaceActions = [this.play];

    this.videoRecordStartActions = [];
    this.videoRecordFinishActions = [];
    this.videoRecordDiscardActions = [];
}

configure(new Effect());