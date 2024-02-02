bnb.scene.enableRecognizerFeature(bnb.FeatureID.RULER);

// let txtField = bnb.scene.getAssetManager().findImage("text");

// bnb.eventListener.on("onUpdate", ()=> {
//     txtField.asTextTexture().setText(bnb.ruler.getValue().toFixed(1)  + " sm");
// })

function onDataUpdate(){
    return bnb.ruler.getValue().toFixed(1);
}