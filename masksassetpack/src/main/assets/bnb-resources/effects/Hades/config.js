function Effect() {
    var self = this;


    this.init = function() {
        Api.meshfxMsg("spawn", 0, 0, "!glfx_FACE");
        Api.meshfxMsg("spawn", 1, 0, "hades.bsm2");
        Api.meshfxMsg("spawn", 2, 0, "fire.bsm2");
        Api.meshfxMsg("spawn", 3, 0, "tri.bsm2");
        Api.meshfxMsg("spawn", 4, 0, "hades_add.bsm2");


        Api.meshfxMsg("dynImass", 2, 0, "joint_Fire_root");
        Api.meshfxMsg("dynImass", 2, 5, "joint_Fire_1");
        Api.meshfxMsg("dynImass", 2, 10, "joint_Fire_end");

        Api.meshfxMsg("dynGravity", 2, 0, "0 1000.0 0");
        Api.meshfxMsg("dynDamping", 2, 90);



        Api.playVideo('frx', true, 1);
        Api.showRecordButton();
    };

    this.restart = function() {
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