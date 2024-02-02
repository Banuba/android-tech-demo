
function Effect()
{
    var self = this;

    this.init = function() {
        Api.meshfxMsg("spawn", 1, 0, "!glfx_FACE");
        Api.meshfxMsg("spawn", 0, 0, "quad.bsm2");
        Api.meshfxMsg("shaderVec4", 0, 0, "1.0 0.5176 0.5372 1.0");
        setColor("[0.0, 0.25, 1.0, 1.0]");
        Api.showRecordButton();
    };

    Api.meshfxMsg("shaderVec4", 0, 1, "1.");

    this.faceActions = [];
    this.noFaceActions = [];

    this.videoRecordStartActions = [];
    this.videoRecordFinishActions = [];
    this.videoRecordDiscardActions = [];
}

function setColor(color)
{
    var c = JSON.parse(color);
    Api.meshfxMsg("shaderVec4", 0, 0, c[0] + " " + c[1] + " " + c[2] + " " + c[3]);
}

configure(new Effect());
