bnb.scene.enableRecognizerFeature(bnb.FeatureID.RING);

const rl = bnb.scene.getRenderList();

const rin = bnb.scene.getAssetManager().findRenderTarget("ColorCorrectionRT");
const ain = rin.getAttachments()[0];

const rout = bnb.scene.getAssetManager().findRenderTarget("LutRT");
const aout = rout.getAttachments()[0];

const lightStreaks = require("bnb_js/light_streaks.js");

lightStreaks.BNBApplyLightStreaks(ain, aout, 0.9, [1., 1., 1., 1.0], bnb.BlendingMode.SCREEN);
