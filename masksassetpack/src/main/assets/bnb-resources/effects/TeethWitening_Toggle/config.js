function Effect() {
    var self = this;

    this.init = function() {
        Api.meshfxMsg("shaderVec4", 0, 0, "1.");
        Api.meshfxMsg("spawn", 1, 0, "!glfx_FACE");
        Api.meshfxMsg("spawn", 0, 0, "Beauty09.bsm2");
        Api.meshfxMsg("spawn", 2, 0, "quad.bsm2");


        Api.showRecordButton();
    };

    this.faceActions = [];
    this.noFaceActions = [];

    this.videoRecordStartActions = [];
    this.videoRecordFinishActions = [];
    this.videoRecordDiscardActions = [];
}

function onDataUpdate(toggle) {
    Api.meshfxMsg("shaderVec4", 0, 0, String(toggle));
}

configure(new Effect());