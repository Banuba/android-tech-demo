function Effect() {
    var self = this;

    this.init = function () {
        Api.meshfxMsg("spawn", 1, 0, "!glfx_FACE");
        Api.meshfxMsg("spawn", 0, 0, "SmallPrincess.bsm2");
        Api.meshfxMsg("spawn", 3, 0, "diamond.bsm2");   
        
        Api.meshfxMsg("dynImass", 3, 15, "joint_root");
        Api.meshfxMsg("dynImass", 3, 15, "joint_midd");
        Api.meshfxMsg("dynImass", 3, 15, "jointend");
		Api.meshfxMsg("dynGravity", 3, 0, "0 -700 0");

        Api.showRecordButton();
    };
    this.restart = function () {
        Api.meshfxReset();
        self.init();
    };

    this.faceActions = [];
    this.noFaceActions = [];

    this.videoRecordStartActions = [];
    this.videoRecordFinishActions = [];
    this.videoRecordDiscardActions = [this.restart];
}
configure(new Effect());