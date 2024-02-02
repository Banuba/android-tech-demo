// let isPlaying = false;
// let isInteractive = true;

// var settings = {
//     effectName: "MinnieMouse7"
// };

// var spendTime = 0;

// var analytic = {
//     spendTimeSec: 0,
//     taps: 0
// };

// function sendAnalyticsData() {
//     var _analytic;
//     analytic.spendTimeSec = Math.round(spendTime / 1000);
//     _analytic = {
//         'Event Name': 'Effects Stats',
//         'Effect Name': settings.effectName,
//         'Effect Action': 'Tap', // or 'Swipe'
//         'Action Count': String(analytic.taps),
//         'Spend Time': String(analytic.spendTimeSec)
//     };
//     Api.print('sended analytic: ' + JSON.stringify(_analytic));
//     Api.effectEvent('analytic', _analytic);
// }

// function onStop() {
//     try {
//         sendAnalyticsData();
//     } catch (err) {
//         Api.print(err);
//     }
// }

// function onFinish() {
//     try {
//         sendAnalyticsData();
//     } catch (err) {
//         Api.print(err);
//     }
// }

// var current_mask = 1;

// function onTouchesBegan(touches) {
//     if(isInteractive) {
//         Api.meshfxMsg("del", 5);
//         //Api.hideHint();
//         analytic.taps++;
//         switch(current_mask){
//             case 1:
//                 delPrevMask();
//                 spawn2thMask();
//                 current_mask = 2;
//                 break;
//             case 2:
//                 delPrevMask();
//                 spawn3thMask();
//                 current_mask = 3;
//                 break;
//             case 3:
//                 delPrevMask();
//                 spawn4thMask();
//                 current_mask = 4;
//                 break;
//             case 4:
//                 delPrevMask();
//                 spawn1thMask();
//                 current_mask = 1;
//                 break;
//         }
//         //Add your logic
//     }
// }

// function delPrevMask(){
//     Api.meshfxMsg("del", 0);
//     Api.meshfxMsg("del", 1);
//     Api.meshfxMsg("del", 2);
//     Api.stopSound("music_1.ogg");
//     Api.stopSound("music_2.ogg");
//     Api.stopSound("music_3.ogg");
//     Api.stopSound("music_4.ogg");
// }
// // --> add to function Effect() FROM HERE
// function spawn1thMask(){
//         isPlaying && Api.playSound("music_1.ogg", true, 1.0);
//         Api.meshfxMsg("spawn", 0, 0, "Bowknot.bsm2");
//         Api.meshfxMsg("spawn", 1, 0, "Glasses_pink.bsm2");
//         Api.meshfxMsg("spawn", 2, 0, "Mouse_ears.bsm2");

//         Api.meshfxMsg("tex", 2, 0, "Mouse_ears_mat_BaseColor.png");
//         Api.meshfxMsg("tex", 2, 1, "Mouse_ears_mat_Normal.png");
//         Api.meshfxMsg("tex", 2, 2, "Mouse_ears_mat_Metallic.png");
//         Api.meshfxMsg("tex", 2, 3, "Mouse_ears_mat_Roughness.png");

//         Api.meshfxMsg("tex", 0, 0, "Bowknot_pink_BaseColor.png");
//         Api.meshfxMsg("tex", 0, 1, "Bowknot_pink_Normal.png");
//         Api.meshfxMsg("tex", 0, 2, "Bowknot_pink_Metallic.png");
//         Api.meshfxMsg("tex", 0, 3, "Bowknot_pink_Roughness.png");

//         Api.meshfxMsg("tex", 7, 0, "Makeup.png");
// }

// function spawn2thMask(){
//     isPlaying && Api.playSound("music_2.ogg", true, 1.0);
//     Api.meshfxMsg("spawn", 0, 0, "Unicorn.bsm2");
//     Api.meshfxMsg("spawn", 1, 0, "Shadow.bsm2");
//     Api.meshfxMsg("spawn", 2, 0, "Mouse_ears.bsm2");

//     Api.meshfxMsg("tex", 2, 0, "Mouse_ears_mat_BaseColor.png");
//     Api.meshfxMsg("tex", 2, 1, "Mouse_ears_mat_Normal.png");
//     Api.meshfxMsg("tex", 2, 2, "Mouse_ears_mat_Metallic.png");
//     Api.meshfxMsg("tex", 2, 3, "Mouse_ears_mat_Roughness.png");

//     Api.meshfxMsg("tex", 7, 0, "Makeup.png");
// }

// function spawn3thMask(){
//     isPlaying && Api.playSound("music_3.ogg", true, 1.0);
//     Api.meshfxMsg("spawn", 0, 0, "Bowknot.bsm2");

//     Api.meshfxMsg("tex", 0, 0, "Bowknot_skull_BaseColor.png");
//     Api.meshfxMsg("tex", 0, 1, "Bowknot_skull_Normal.png");
//     Api.meshfxMsg("tex", 0, 2, "Bowknot_skull_Metallic.png");
//     Api.meshfxMsg("tex", 0, 3, "Bowknot_skull_Roughness.png");

//     Api.meshfxMsg("spawn", 2, 0, "Mouse_ears.bsm2");
//     Api.meshfxMsg("tex", 2, 0, "Mouse_ears_latex_BaseColor.png");
//     Api.meshfxMsg("tex", 2, 1, "Mouse_ears_latex_Normal.png");
//     Api.meshfxMsg("tex", 2, 2, "Mouse_ears_latex_Metallic.png");
//     Api.meshfxMsg("tex", 2, 3, "Mouse_ears_latex_Roughness.png");

//     Api.meshfxMsg("tex", 7, 0, "Makeup_kiss.png");
// }

// function spawn4thMask(){
//     isPlaying && Api.playSound("music_4.ogg", true, 1.0);
//     Api.meshfxMsg("spawn", 0, 0, "Bowknot.bsm2");

//     Api.meshfxMsg("tex", 0, 0, "Bowknot_leopard_BaseColor.png");
//     Api.meshfxMsg("tex", 0, 1, "Bowknot_pink_Normal.png");
//     Api.meshfxMsg("tex", 0, 2, "Bowknot_pink_Metallic.png");
//     Api.meshfxMsg("tex", 0, 3, "Bowknot_pink_Roughness.png");

//     Api.meshfxMsg("spawn", 2, 0, "Mouse_ears.bsm2");
//     Api.meshfxMsg("tex", 2, 0, "Mouse_ears_mat_BaseColor.png");
//     Api.meshfxMsg("tex", 2, 1, "Mouse_ears_mat_Normal.png");
//     Api.meshfxMsg("tex", 2, 2, "Mouse_ears_mat_Metallic.png");
//     Api.meshfxMsg("tex", 2, 3, "Mouse_ears_mat_Roughness.png");

//     Api.meshfxMsg("spawn", 1, 0, "Glasses_leopard.bsm2");

//     Api.meshfxMsg("tex", 7, 0, "Makeup.png");

// }
// // --> TO HERE 
// function Effect() {
//     var self = this;

//     this.meshes = [
//         { file: "Bowknot.bsm2", anims: [
//             { a: "Take 001", t: 8333 },
//         ] },
//         { file: "Glasses_leopard.bsm2", anims: [
//             { a: "Take 001", t: 10000 },
//         ] },
//         { file: "Glasses_pink.bsm2", anims: [
//             { a: "Take 001", t: 10000 },
//         ] },
//         { file: "Mouse_ears.bsm2", anims: [
//             { a: "Take 001", t: 8333 },
//         ] },
//         { file: "Shadow.bsm2", anims: [
//             { a: "Take 001", t: 10000 },
//         ] },
//         { file: "Unicorn.bsm2", anims: [
//             { a: "Take 001", t: 10000 },
//         ] },
//         { file: "morph.bsm2", anims: [
//             { a: "Take 001", t: 8291 },
//         ] },
//     ];

//     this.play = function() {
//         var now = (new Date()).getTime();
//         for(var i = 0; i < self.meshes.length; i++) {
//             if(now > self.meshes[i].endTime) {
//                 self.meshes[i].animIdx = (self.meshes[i].animIdx + 1)%self.meshes[i].anims.length;
//                 Api.meshfxMsg("animOnce", i, 0, self.meshes[i].anims[self.meshes[i].animIdx].a);
//                 self.meshes[i].endTime = now + self.meshes[i].anims[self.meshes[i].animIdx].t;
//             }
//         }

//         // if(Api.isMouthOpen()) {
//         //  Api.hideHint();
//         // }
//     };

//     this.init = function() {
//         Api.meshfxMsg("spawn", 7, 0, "!glfx_FACE");
//         Api.meshfxMsg("spawn", 6, 0, "morph.bsm2");
//         Api.meshfxMsg("spawn", 5, 0, "plane.bsm2");
        

//         spawn1thMask();

//         timeOut(3000, function(){
//             Api.meshfxMsg("del", 5);
//         });
//         // Api.showHint("Open mouth");
//         Api.playVideo("frx", true, 1.0);
//         Api.showRecordButton();
//     };

//     this.restart = function() {
//         Api.meshfxReset();
//         self.init();
//     };

//     this.timeUpdate = function () { 
//         if (self.lastTime === undefined) self.lastTime = (new Date()).getTime();
    
//         var now = (new Date()).getTime();
//         self.delta = now - self.lastTime;
//         if (self.delta < 3000) { // dont count spend time if application is minimized
//             spendTime += self.delta;
//         }
//         self.lastTime = now;
//     };
    
//     this.faceActions = [this.timeUpdate];
//     this.noFaceActions = [this.timeUpdate];

//     this.videoRecordStartActions = [delTap];
//     this.videoRecordFinishActions = [];
//     this.videoRecordDiscardActions = [this.restart];
// }

// function delTap(){
//     Api.meshfxMsg("del", 5);
// }

// function onTakePhotoStart(){
//     delTap();
// }

// function timeOut(delay, callback) {
//     var timer = new Date().getTime();

//     effect.faceActions.push(removeAfterTimeOut);
//     effect.noFaceActions.push(removeAfterTimeOut);

//     function removeAfterTimeOut() {
//         var now = new Date().getTime();

//         if (now >= timer + delay) {
//             var idx = effect.faceActions.indexOf(removeAfterTimeOut);
//             effect.faceActions.splice(idx, 1);
//             idx = effect.noFaceActions.indexOf(removeAfterTimeOut);
//             effect.noFaceActions.splice(idx, 1);
//             callback();
//         }
//     }
// }

// function stopMusic(){
//     isPlaying = false;
//     Api.stopSound("music_1.ogg");
//     Api.stopSound("music_2.ogg");
//     Api.stopSound("music_3.ogg");
//     Api.stopSound("music_4.ogg");
// }

// function hideInteractive(){
//     isInteractive = false;
//     Api.hideHint();
// }

// configure(new Effect());

// // Background = require('bnb_js/background');

// // Background.texture("preview.png");
// // Background.contentMode("fill")
