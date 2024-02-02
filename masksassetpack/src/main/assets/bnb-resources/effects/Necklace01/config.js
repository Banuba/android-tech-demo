const rl = bnb.scene.getRenderList();

const rin = bnb.scene.getAssetManager().findRenderTarget("ColorCorrectionRT");
const ain = rin.getAttachments()[0];

const rout = bnb.scene.getAssetManager().findRenderTarget("EffectRT2");
const aout = rout.getAttachments()[0];

const lightStreaks = require("bnb_js/light_streaks.js");

lightStreaks.BNBApplyLightStreaks(ain, aout, 0.999, [1, 0.5, 1, 1], bnb.BlendingMode.SCREEN);


function Effect() {
    var self = this;


    this.init = function() {
        Api.meshfxMsg("spawn", 2, 0, "!glfx_FACE");
        Api.meshfxMsg("spawn", 0, 0, "necklace_1.bsm2");
        Api.meshfxMsg("spawn", 1, 0, "cut.bsm2");
        Api.meshfxMsg("spawn", 3, 0, "tri.bsm2");


        Api.meshfxMsg("dynImass", 0, 0, "joint_0");
        Api.meshfxMsg("dynImass", 0, 0, "joint_1");
        Api.meshfxMsg("dynImass", 0, 0, "joint_2");
        Api.meshfxMsg("dynImass", 0, 0, "joint_3");
        Api.meshfxMsg("dynImass", 0, 0, "joint_4");
        Api.meshfxMsg("dynImass", 0, 5, "joint_5");
        Api.meshfxMsg("dynImass", 0, 8, "joint_6");
        Api.meshfxMsg("dynImass", 0, 10, "joint_7");
        Api.meshfxMsg("dynImass", 0, 15, "joint_8");
        Api.meshfxMsg("dynImass", 0, 15, "joint_9");
        Api.meshfxMsg("dynImass", 0, 10, "joint_10");
        Api.meshfxMsg("dynImass", 0, 8, "joint_11");
        Api.meshfxMsg("dynImass", 0, 0, "joint_12");
        Api.meshfxMsg("dynImass", 0, 100, "joint_13");
        Api.meshfxMsg("dynImass", 0, 0, "joint_14");
        Api.meshfxMsg("dynImass", 0, 100, "joint_15");
        Api.meshfxMsg("dynImass", 0, 0, "joint_16");
        Api.meshfxMsg("dynImass", 0, 100, "joint_17");

        Api.meshfxMsg("dynGravity", 0, 0, "0 -600 300");

        //Api.meshfxMsg("dynConstraint", 0, 99, "joint_0 joint_17");
        //Api.meshfxMsg("dynConstraint", 0, 99, "joint_0 joint_16");
        

        Api.meshfxMsg("dynDamping", 0, 90);


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