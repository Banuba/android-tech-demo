function Effect() {
    var self = this;




    this.init = function() {
        Api.meshfxMsg("spawn", 4, 0, "!glfx_FACE");

        Api.meshfxMsg("spawn", 0, 0, "Cap.bsm2");
        // Api.meshfxMsg("animOnce", 0, 0, "static");

        Api.meshfxMsg("spawn", 1, 0, "Cut.bsm2");
        // Api.meshfxMsg("animOnce", 1, 0, "static");

        Api.meshfxMsg("spawn", 2, 0, "Embroidery.bsm2");
        // Api.meshfxMsg("animOnce", 2, 0, "static");


        // Api.showHint("Open mouth");

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