const settings_json = JSON.parse(require("../settings.js"))
const { FaceRegion } = require("./region.js")

// aliases
settings_json["eyeshadow2"] =
  settings_json["eyeshadow1"] =
  settings_json["eyeshadow0"] =
    settings_json["eyeshadow"]

const MakeupRegions = {
  blush: new FaceRegion("blush"),
  concealer: new FaceRegion("concealer"),
  contour: new FaceRegion("contour"),
  eyebrows: new FaceRegion("eyebrows", ["lbrow_nn", "rbrow_nn"]),
  eyelashes: new FaceRegion("eyelashes"),
  eyeliner: new FaceRegion("eyeliner"),
  eyeshadow0: new FaceRegion("eyeshadow0"),
  eyeshadow1: new FaceRegion("eyeshadow1"),
  eyeshadow2: new FaceRegion("eyeshadow2"),
  foundation: new FaceRegion("foundation"),
  highlighter: new FaceRegion("highlighter"),
  lipstick: new FaceRegion("lipstick", ["lips_nn"]),
  lipsliner: new FaceRegion("lipsliner", ["lips_nn"]),
}
// aliases
MakeupRegions.eyeshadow = MakeupRegions.eyeshadow0
MakeupRegions.gloss = MakeupRegions.lipstick

const apply = (region, { color, finish, coverage, strength }) => {
  if (typeof coverage === "undefined") coverage = strength // backward compatibility with old coverage name

  const makeupRegion = MakeupRegions[region]
  if (!makeupRegion) {
    bnb.log(`[WARN] The region "${region}" is not yet implemented`)
    return
  }

  const regionSettings = settings_json[region]
  if (!regionSettings) {
    bnb.log(`[WARN] No settings found for the "${region}" region`)
    return
  }

  const finishSettings = finish instanceof Object ? finish : regionSettings[finish]

  if (!finishSettings) {
    bnb.log(`[WARN] The finish "${finish}" does not exist in region "${region}"`)
    return
  }
  if (Object.keys(finishSettings).length < 5) {
    bnb.log(
      `[WARN] The finish "${finish}" of region "${region}" is malformed: one of the A, C, K, R, P parameters is missing`
    )
  }

  const { texture, K: kSettings, ...rest } = finishSettings

  let K

  if (typeof coverage === "number") K = coverage
  else if (typeof kSettings === "number") K = kSettings
  /*
   * maps
   * "l", "lo", "low" -> "low"
   * "m", "mi", "mid" -> "mid"
   * "h", "hi", "hig", "high" -> "high"
   */ else
    for (const preset of ["low", "mid", "high"])
      if (preset.startsWith(coverage)) K = kSettings[preset]

  if ("lipstick" === region) bnb.scene.enableRecognizerFeature(bnb.FeatureID.LIPS_CORRECTION)
  if ("eyebrows" === region) bnb.scene.enableRecognizerFeature(bnb.FeatureID.BROWS_CORRECTION)
  if (["eyelashes", "eyeliner"].includes(region))
    bnb.scene.enableRecognizerFeature(bnb.FeatureID.EYES_CORRECTION)

  bnb.scene.enableRecognizerFeature(bnb.FeatureID.FACE_MESH_CORRECTION)

  makeupRegion.color(color)
  makeupRegion.parameters({ K, ...rest })
  if (texture) makeupRegion.texture(texture)
}
const clear = () => {
  bnb.scene.disableRecognizerFeature(bnb.FeatureID.BROWS_CORRECTION)
  bnb.scene.disableRecognizerFeature(bnb.FeatureID.EYES_CORRECTION)
  bnb.scene.disableRecognizerFeature(bnb.FeatureID.LIPS_CORRECTION)
  bnb.scene.disableRecognizerFeature(bnb.FeatureID.FACE_MESH_CORRECTION)

  for (const makeupRegion of Object.values(MakeupRegions)) makeupRegion.clear()
}
const setState = (state) => {
  clear()

  for (const [region, settings] of Object.entries(state)) apply(region, settings)

  setMode()
}

const assets = bnb.scene.getAssetManager()
const fakeSkin = assets.findMaterial("shaders/nn_combine").findParameter("fake_skin_nn_active")
const skinNN = assets.findImage("skin_nn").asSegmentationMask()
const lbrowNN = assets.findImage("lbrow_nn").asSegmentationMask()
const rbrowNN = assets.findImage("rbrow_nn").asSegmentationMask()

let mode = "quality"

/** @param {"speed"|"quality"} [mode] */
const setMode = (newMode) => {
  if (newMode) mode = newMode

  const isQualityMode = mode === "quality"
  const isSpeedMode = !isQualityMode

  fakeSkin.setVector4(new bnb.Vec4(isQualityMode ? 0 : 1, 0, 0, 0))
  skinNN.setActive(isQualityMode)

  if (!MakeupRegions.eyebrows.isVisible())
    lbrowNN.setActive(isSpeedMode), rbrowNN.setActive(isSpeedMode)
}

exports.setState = setState
exports.setMode = setMode
