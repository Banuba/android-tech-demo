function Effect() {
    var self = this;

    this.meshes = [
        { file: "eyes.bsm2", anims: [
            { a: "Take 001", t: 1200 },
        ] },
        { file: "geo.bsm2", anims: [
            { a: "Take 001", t: 1200 },
        ] },
        { file: "morph.bsm2", anims: [
            { a: "static", t: 0 },
        ] },
        { file: "toungue.bsm2", anims: [
            { a: "Take 001", t: 1200 },
        ] },
    ];

    this.play = function() {
        var now = (new Date()).getTime();
        for(var i = 0; i < self.meshes.length; i++) {
            if(now > self.meshes[i].endTime) {
                self.meshes[i].animIdx = (self.meshes[i].animIdx + 1)%self.meshes[i].anims.length;
                Api.meshfxMsg("animOnce", i, 0, self.meshes[i].anims[self.meshes[i].animIdx].a);
                self.meshes[i].endTime = now + self.meshes[i].anims[self.meshes[i].animIdx].t;
            }
        }

        // if(Api.isMouthOpen()) {
        //  Api.hideHint();
        // }
    };

    this.init = function() {
        Api.meshfxMsg("spawn", 0, 0, "morph.bsm2");        
        Api.meshfxMsg("spawn", 1, 0, "!glfx_FACE");
        Api.meshfxMsg("spawn", 2, 0, "geo.bsm2");
        Api.meshfxMsg("spawn", 3, 0, "eye_L.bsm2");
        Api.meshfxMsg("spawn", 4, 0, "eye_R.bsm2");        
        Api.meshfxMsg("spawn", 5, 0, "toungue.bsm2");


        Api.playVideo("frx", true, 1);


        Api.meshfxMsg("dynImass", 3,  0, "joint_end_L");
        Api.meshfxMsg("dynImass", 3,  1, "joint_root_L");
        Api.meshfxMsg("dynImass", 3,  0, "joint_base_L");

        Api.meshfxMsg("dynImass", 4,  0, "joint_end_R");
        Api.meshfxMsg("dynImass", 4,  1, "joint_root_R");
        Api.meshfxMsg("dynImass", 4,  0, "joint_base_R");


        Api.meshfxMsg("dynGravity", 3, 0, "0 0 100");
        Api.meshfxMsg("dynGravity", 4, 0, "0 0 100");
        Api.meshfxMsg("dynDamping", 3, 97);
        Api.meshfxMsg("dynDamping", 4, 97);


        Api.meshfxMsg("dynImass", 5,  0, "joint_tongue_root");
        Api.meshfxMsg("dynImass", 5,  0, "joint_tongue_1");
        Api.meshfxMsg("dynImass", 5,  1, "joint_tongue_2");
        Api.meshfxMsg("dynImass", 5,  1, "joint_tongue_3");
        Api.meshfxMsg("dynImass", 5,  3, "joint_tongue_4");
        Api.meshfxMsg("dynImass", 5,  3, "joint_tongue_5");
        Api.meshfxMsg("dynImass", 5,  4, "joint_tongue_6");
        Api.meshfxMsg("dynImass", 5,  2, "joint_tongue_end");
        
        //Api.meshfxMsg("dynConstraint", 5, 100, "joint_tongue_1 joint_tongue_2");


        Api.meshfxMsg("dynGravity", 5, 0, "0 -1800 0");
        Api.meshfxMsg("dynDamping", 5, 98);
        Api.meshfxMsg("dynSphere", 5, 0, "0 -65 44 40");       


        for(var i = 0; i < self.meshes.length; i++) {
            self.meshes[i].animIdx = -1;
            self.meshes[i].endTime = 0;
        }

        //self.faceActions = [self.play];
        // Enable background audio playback
        Api.playSound("music.ogg", true, 1);
        // Api.showHint("Open mouth");

        Api.showRecordButton();
    };

    this.restart = function() {
        Api.meshfxReset();
        Api.stopSound("music.ogg");
        self.init();
    };

    this.faceActions = [getMouthY];
    this.noFaceActions = [];

    this.videoRecordStartActions = [];
    this.videoRecordFinishActions = [];
    this.videoRecordDiscardActions = [this.restart];
}

function getMouthY() {
    var mouthOpenAmount = Math.round(world.latents[0] * 5);
    if (mouthOpenAmount < 0) { 
        Api.meshfxMsg( "shaderVec4", 0, 0, "0.0 0.0 0.0 0.0" );
        // return 0;
    } else {
        Api.meshfxMsg( "shaderVec4", 0, 0, mouthOpenAmount + " 0.0 0.0 0.0" );
    }
}

configure(new Effect());