bnb.scene.enableRecognizerFeature(bnb.FeatureID.FACE_ACNE);

function calculateAcneSize(param, min, max) {
    return min + param * (max - min)
}

let params = []
let uifitMode = 0;
let acneMin = 10;
let acneMax = 100;
let acneSize = calculateAcneSize(0.5, acneMin, acneMax)
let hasTouched = false;

function resetAcne() {
    hasTouched = false;
    params = []

    let surfW = bnb.scene.getSurfaceWidth();
    let surfH = bnb.scene.getSurfaceHeight();
    params.push(new bnb.FeatureParameter(surfW, surfH, uifitMode, 0));
    bnb.scene.addFeatureParam(bnb.FeatureID.FACE_ACNE, params)
}

function setFitMode(fitmode){
    uifitMode = fitmode
}

function onTouch(touches)  {
    hasTouched = true
    let surfW = bnb.scene.getSurfaceWidth();
    let surfH = bnb.scene.getSurfaceHeight();

    if(params.length == 0){
        params.push(new bnb.FeatureParameter(surfW, surfH, uifitMode, 0));
    }else{
        params[0] = new bnb.FeatureParameter(surfW, surfH, uifitMode, 0);
    }

    for (let i = 0; i < touches.length; i++) {
        bnb.log("X:" + touches[i].x + " Y:" + touches[i].y);
        params.push(new bnb.FeatureParameter(touches[i].x, touches[i].y, acneSize, acneSize))
    }
    bnb.scene.addFeatureParam(bnb.FeatureID.FACE_ACNE, params)
}

bnb.eventListener.on("onTouchesEnded", onTouch);

function GetTouchStatus() {
    return hasTouched;
}

function onDataUpdate(param) {
    acneSize = calculateAcneSize(param, acneMin, acneMax)
    bnb.log("Acne size: " + acneSize)
}