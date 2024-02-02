const rl = bnb.scene.getRenderList();

const rin = bnb.scene.getAssetManager().findRenderTarget("ColorCorrectionRT");
const ain = rin.getAttachments()[0];

const rout = bnb.scene.getAssetManager().findRenderTarget("EffectRT2");
const aout = rout.getAttachments()[0];

const lightStreaks = require("bnb_js/light_streaks.js");

lightStreaks.BNBApplyLightStreaks(ain, aout, 0.999, [1, 1, 1, 1], bnb.BlendingMode.SCREEN);

function Effect() {
    var self = this;


    this.init = function() {
        Api.meshfxMsg("spawn", 2, 0, "!glfx_FACE");
        Api.meshfxMsg("spawn", 0, 0, "necklace_2.bsm2");
        Api.meshfxMsg("spawn", 1, 0, "head.bsm2");
        Api.meshfxMsg("spawn", 3, 0, "tri.bsm2");


        Api.meshfxMsg("dynImass", 0, 0, "Armature");
        Api.meshfxMsg("dynImass", 0, 0, "Bone");
        Api.meshfxMsg("dynImass", 0, 0, "Bone_001");
        Api.meshfxMsg("dynImass", 0, 1, "Bone_002");
        Api.meshfxMsg("dynImass", 0, 2, "Bone_003");
        Api.meshfxMsg("dynImass", 0, 4, "Bone_004");
        Api.meshfxMsg("dynImass", 0, 5, "Bone_004_end");

        Api.meshfxMsg("dynGravity", 0, 0, "0 -1600 800");

        Api.meshfxMsg("dynDamping", 0, 98);

        Api.meshfxMsg("dynSphere", 0, 0, "0 -40 10 75");


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