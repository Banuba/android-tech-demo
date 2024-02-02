function Effect()
{
    var self = this;

    this.init = function() {
        Api.meshfxMsg("spawn", 1, 0, "!glfx_FACE");
        Api.meshfxMsg("spawn", 0, 0, "quad.bsm2");
        Api.meshfxMsg("spawn", 2, 0, "tri.bsm2");

        Api.meshfxMsg("shaderVec4", 0, 0, "1.");

        Api.showRecordButton();
    };

    this.faceActions = [];
    this.noFaceActions = [ ];

    this.videoRecordStartActions = [];
    this.videoRecordFinishActions = [];
    this.videoRecordDiscardActions = [];
}

configure(new Effect());


function onDataUpdate(toggle) {
    Api.meshfxMsg("shaderVec4", 0, 0, String(toggle));
}