function Effect() {
    var self = this;

    this.meshes = [
        { file: "cut.bsm2", anims: [
                        { a: "static", t: 0 },
                ],

                is_physics_applied: Boolean("True".toLowerCase())
        },
        { file: "earings_te50085_L.bsm2", anims: [
                        { a: "Take 001", t: 3333 },
                ],

                is_physics_applied: Boolean("True".toLowerCase())
        },
        { file: "earings_te50085_R.bsm2", anims: [
                        { a: "Take 001", t: 3333 },
                ],

                is_physics_applied: Boolean("True".toLowerCase())
        },
    ];

    this.play = function() {
        var now = (new Date()).getTime();
        for(var i = 0; i < self.meshes.length; i++) {
                if(now > self.meshes[i].endTime) {
                        self.meshes[i].animIdx = (self.meshes[i].animIdx + 1)%self.meshes[i].anims.length;
                        if (!self.meshes[i].is_physics_applied) {
                                Api.meshfxMsg("animOnce", i, 0, self.meshes[i].anims[self.meshes[i].animIdx].a);
                        }
                        self.meshes[i].endTime = now + self.meshes[i].anims[self.meshes[i].animIdx].t;
                }
        }

        // if(Api.isMouthOpen()) {
        //  Api.hideHint();
        // }
    };

    this.init = function() {
        Api.meshfxMsg("spawn", 3, 0, "!glfx_FACE");

        Api.meshfxMsg("spawn", 0, 0, "cut.bsm2");
        // Api.meshfxMsg("animOnce", 0, 0, "");
        // Api.meshfxMsg("animOnce", 0, 1, "");

        Api.meshfxMsg("spawn", 1, 0, "earings_te50085_L.bsm2");
        // Api.meshfxMsg("animOnce", 1, 0, "");
        // Api.meshfxMsg("animOnce", 1, 1, "");

        Api.meshfxMsg("spawn", 2, 0, "earings_te50085_R.bsm2");
        // Api.meshfxMsg("animOnce", 2, 0, "");
        // Api.meshfxMsg("animOnce", 2, 1, "");


        Api.meshfxMsg("spawn", 4, 0, "tri.bsm2");

        Api.meshfxMsg("dynImass", 0, 0, "head");




        Api.meshfxMsg("dynImass", 1, 0, "CATRigLeft");
        Api.meshfxMsg("dynImass", 1, 8, "CATRigL1");
        Api.meshfxMsg("dynImass", 1, 8, "CATRigL2");

        Api.meshfxMsg("dynGravity", 1, 0, "0 -1200.0 0");

        Api.meshfxMsg("dynDamping", 1, 95);
        Api.meshfxMsg("dynSphere", 1, 0, "0 -47 -10 78");

        Api.meshfxMsg("dynImass", 2, 0, "CATRigRight");
        Api.meshfxMsg("dynImass", 2, 8, "CATRigR1");
        Api.meshfxMsg("dynImass", 2, 8, "CATRigR2");

        Api.meshfxMsg("dynGravity", 2, 0, "0 -1200.0 0");

        Api.meshfxMsg("dynDamping", 2, 95);
        Api.meshfxMsg("dynSphere", 2, 0, "0 -47 -10 78");


        for(var i = 0; i < self.meshes.length; i++) {
            self.meshes[i].animIdx = -1;
            self.meshes[i].endTime = 0;
        }
        self.faceActions = [self.play];

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