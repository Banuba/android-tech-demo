const rl = bnb.scene.getRenderList();

const rin = bnb.scene.getAssetManager().findRenderTarget("ColorCorrectionRT");
const ain = rin.getAttachments()[0];

const rout = bnb.scene.getAssetManager().findRenderTarget("EffectRT2");
const aout = rout.getAttachments()[0];

const lightStreaks = require("bnb_js/light_streaks.js");

lightStreaks.BNBApplyLightStreaks(ain, aout, 0.99, [1., 0.5, 1., 1.0], bnb.BlendingMode.SCREEN);

function Effect() {
    var self = this;

    this.init = function() {
        Api.meshfxMsg("spawn", 2, 0, "!glfx_FACE");
        Api.meshfxMsg("spawn", 0, 0, "earring_1.bsm2");
        Api.meshfxMsg("spawn", 1, 0, "head.bsm2");
        Api.meshfxMsg("spawn", 3, 0, "tri.bsm2");


        Api.meshfxMsg("dynImass", 0, 0, "Armature");
        Api.meshfxMsg("dynImass", 0, 0, "Bone");

        Api.meshfxMsg("dynImass", 0, 0, "Bone_L_002");
        Api.meshfxMsg("dynImass", 0, 1, "Bone_L_003");
        Api.meshfxMsg("dynImass", 0, 2, "Bone_L_004");
        Api.meshfxMsg("dynImass", 0, 3, "Bone_L_005");
        Api.meshfxMsg("dynImass", 0, 4, "Bone_L_end");

        Api.meshfxMsg("dynImass", 0, 0, "Bone_R_002");
        Api.meshfxMsg("dynImass", 0, 1, "Bone_R_003");
        Api.meshfxMsg("dynImass", 0, 2, "Bone_R_004");
        Api.meshfxMsg("dynImass", 0, 3, "Bone_R_005");
        Api.meshfxMsg("dynImass", 0, 4, "Bone_R_end");



        Api.meshfxMsg("dynGravity", 0, 0, "0 -1800 0");

        Api.meshfxMsg("dynDamping", 0, 99);

        Api.meshfxMsg("dynSphere", 0, 0, "0 -38 -10 82");


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