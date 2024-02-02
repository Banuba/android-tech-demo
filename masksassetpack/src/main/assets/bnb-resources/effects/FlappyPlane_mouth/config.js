require("bnb_js/timers.js")

Background = require('bnb_js/background');
Background.contentMode("fill")

const component = bnb.scene.getAssetManager().findMaterial("mat_rectangular").findParameter("tpos");

const audio = bnb.scene.getAssetManager().findAudioTrack("Airplane.ogg").asMedia();

const nose = bnb.scene.getRoot().findChildByName("plane_3").getComponent(bnb.ComponentType.TRANSFORMATION).asTransformation();
const bg = bnb.scene.getAssetManager().findMaterial("bg").findParameter("pos");
const face_pos = bnb.scene.getAssetManager().findMaterial("retouch").findParameter("qpos");
const helmet_pos = bnb.scene.getAssetManager().findMaterial("Quad_V2").findParameter("hpos");
const bd_pos = bnb.scene.getAssetManager().findMaterial("Quad_V1").findParameter("bdpos");
const border_pos = bnb.scene.getAssetManager().findMaterial("Quad_V4").findParameter("borderpos");

const plane = bnb.scene.getAssetManager().findMaterial("mat_square").findParameter("bpos");
const MV = bnb.scene.getRoot().findChildByName("face_tracker0").getComponent(bnb.ComponentType.TRANSFORMATION).asTransformation();

let txtField = bnb.scene.getAssetManager().findImage("text");
const scoreComp = bnb.scene.getRoot().findChildByName("text_surface").getComponent(bnb.ComponentType.MESH_INSTANCE).asMeshInstance();
const startComp = bnb.scene.getRoot().findChildByName("text_start").getComponent(bnb.ComponentType.MESH_INSTANCE).asMeshInstance();
const looseComp = bnb.scene.getRoot().findChildByName("text_lose").getComponent(bnb.ComponentType.MESH_INSTANCE).asMeshInstance();

scoreComp.setVisible(false)
looseComp.setVisible(false)

let face = bnb.scene.getRoot().findChildByName("face_tracker0").getComponent(bnb.ComponentType.FACE_TRACKER).asFaceTracker()
let GameOver = false;
const speedFactor = 0.05;

const Ytranslations = [
    [-200, "down"],
    [100, "up"],
    [200, "up"],
    [150, "up"],
    [-100, "down"],
    [-150, "down"],
    [-125, "down"]

]
let transl = component.getVector4();

let state = Ytranslations[0][1];
// component.setTranslation(new bnb.Vec3(xPos, 150, transl.z))

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let xPos =  transl.x
let yPos = Ytranslations[0][0];

let birdXPos = -105;
let birdYPos = 0;
let birdRot = nose.getRotation().z;

let birdWidth = 20;
let birdHeight = 20;
let boundWidth = 20;
if(bnb.RenderInfo.getPlatform() == "iOS" || bnb.RenderInfo.getPlatform() == "Android"){
    boundWidth = 50;
}

let boundHeight = 145;

let isPlaying = false;

let score = 0;

let grav = 1;
const velocity = 5;

let offset = 0;

let rotation  = 0;

function rotateTube(type){
    switch(type){
        case "up":
            rotation = -1.;
            return;
        case "down":
            rotation = 0.;
            return;      
    }
}

function degreeToRadians(degree){
    return degree * Math.PI/180.;
}


function fall(){
        birdYPos -= grav;
        plane.setVector4(new bnb.Vec4(birdYPos, 0, 0, 0))
        face_pos.setVector4(new bnb.Vec4(birdYPos, 0, 0, 0))
        helmet_pos.setVector4(new bnb.Vec4(birdYPos, 0, 0, 0))
        grav += 0.2;
        nose.setRotation(new bnb.Vec3(0, 0,birdRot))
        if(birdRot >= degreeToRadians(-20))
            birdRot -= degreeToRadians(1);
        if(birdYPos <= -160)
            lose()
}

function jump(){
    if(birdYPos < 130){
        grav -= velocity+grav;
        if(birdRot <= degreeToRadians(20))
            birdRot = degreeToRadians(20);
    }
}

function checkCollision(obj1, obj2){
    if(state == "up"){
        if((birdYPos-birdHeight > yPos -boundHeight && birdXPos+birdWidth > xPos - boundWidth && birdXPos+birdWidth < xPos + boundWidth) ||
        (birdYPos+birdHeight > yPos -boundHeight && birdXPos+birdWidth > xPos - boundWidth && birdXPos+birdWidth < xPos + boundWidth) ||
        (birdYPos+birdHeight > yPos -boundHeight && birdXPos-birdWidth > xPos + boundWidth && birdXPos+birdWidth < xPos - boundWidth)    
        ){
            lose()
            return true;
        }
    } else if((birdYPos-birdHeight < yPos +boundHeight && birdXPos+birdWidth > xPos - boundWidth && birdXPos+birdWidth < xPos + boundWidth) ||
        (birdYPos+birdHeight < yPos +boundHeight && birdXPos+birdWidth > xPos - boundWidth && birdXPos+birdWidth < xPos + boundWidth) ||
        (birdYPos+birdHeight < yPos +boundHeight && birdXPos-birdWidth > xPos + boundWidth && birdXPos-birdWidth < xPos - boundWidth)    
        ){
            lose()
            return true;
        }
    return false

}

function checkStart(){
    if(!isPlaying && face.isSmiling() && !GameOver){
        isPlaying = true;
        startComp.setVisible(false);
        scoreComp.setVisible(true);
        looseComp.setVisible(false);
        audio.play();
    }
}

function lose(){
    looseComp.setVisible(true);
    isPlaying = false;
    GameOver = true;
    audio.stop();
}

function restart(){
    audio.play()
    xPos = 320;
    offset = 0;
    score = 0;
    grav = 1;
    isPlaying = true;
    GameOver = false;
    birdRot = 0;
    startComp.setVisible(false);
    scoreComp.setVisible(true);
    looseComp.setVisible(false);
    txtField.asTextTexture().setText("Score: "+score);
    birdYPos = 0;
    yPos = Ytranslations[0][0]
    state = Ytranslations[0][1]
    rotateTube(state)

}

bnb.eventListener.on("onUpdate", function(args) {
    if(isPlaying){
        component.setVector4(new bnb.Vec4(xPos, yPos, rotation, 0.))
        xPos -= 6+speedFactor*(score+1);

        if(xPos <= -250){
            xPos = 250
            score += 1;
            txtField.asTextTexture().setText("Score: "+score);
            let i = getRandomInt(0, Ytranslations.length - 1);
            yPos = Ytranslations[i][0]
            state = Ytranslations[i][1]
            rotateTube(state)
        }
        fall()
        if(face.isMouthOpen()){
            jump()
        }

        checkCollision()
    
        bg.setVector4(new bnb.Vec4(offset, 0, 0, 0))
        bd_pos.setVector4(new bnb.Vec4(offset, 0, 0, 0))
        border_pos.setVector4(new bnb.Vec4(offset, 0, 0, 0))

        offset += 0.01;
    } else{
        checkStart()
    }
    if(!isPlaying && face.isSmiling() && GameOver){
        restart();
    }

});

