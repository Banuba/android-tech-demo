const { setState, setMode } = require("./js/index.js")

/**
 * Usage example
 *
 * @example
 * ```js
 * // config.js call example
 *
 * setState({
 *    "foundation": {
 *      "color": "0.82 0.49 0.39",  // "r g b" color
 *      "finish": "matte",
 *      "coverage": "hi"            // "hi" "mid" or "low"
 *    },
 *    "blush": {
 *      "color": "0.81 0.27 0.43",
 *      "finish": "matte",
 *      "coverage": 0.7,            // custom number is allowed too
 *    },
 *    "lipstick": {
 *      "color": "1.0 0.70 0.49",
 *      "finish": {                  // custom dictionary is allowed too
 *        "A": 1,
 *        "C": 1,
 *        "K": 0.5,
 *        "R": 1,
 *        "P": -1,
 *      },
 *    },
 *    // etc
 * })
 * ```
 *
 * @example
 * ```py
 * // python sdk bindings call example":
 *
 * settings = {
 *    "foundation": {
 *      "color": "0.82 0.49 0.39",  // "r g b" color
 *      "finish": "matte",
 *      "coverage": "hi"            // "hi" "mid" or "low"
 *    },
 *    "blush"": {
 *      "color": "0.81 0.27 0.43",
 *      "finish": "matte",
 *      "coverage": 0.7,            // custom number is allowed too
 *    },
 *    "lipstick": {
 *      "color": "1.0 0.70 0.49",
 *      "finish": {                  // custom dictionary is allowed too
 *        "A": 1,
 *        "C": 1,
 *        "K": 0.5,
 *        "R": 1,
 *        "P": -1,
 *      },
 *    },
 *    // etc
 * }
 *
 * state = json.dumps(settings)
 *
 * effect.eval_js(f"setState({state})")
 * ```
 */

// empty state by default
setState({})
// "speed" mode by default, available modes: "speed", "quality"
setMode("speed")

/** You can set a default state here */
// setState(
//   {
//     "blush": {
//       "color": "0.88 0.65 0.75",
//       "finish": "shimmer",
//       "coverage": "mid"
//     },
//     "concealer": {
//       "color": "0.94 0.73 0.66",
//       "finish": "natural",
//       "coverage": 0
//     },
//     "contour": {
//       "color": "1 0 0",
//       "finish": "normal",
//       "coverage": "mid",
//     },
//     "eyebrows": {
//       "color": "0.39 0.26 0.27",
//       "finish": "matte",
//       "coverage": "mid"
//     },
//     "eyeliner": {
//       "color": "0.0 0.0 0.0",
//       "finish": "matte_liquid",
//       "coverage": "hi"
//     },
//     "eyeshadow0": {
//       "color": "0.21 0.42 0.32",
//       "finish": "matte",
//       "coverage": "hi"
//     },
//     "eyeshadow1": {
//       "color": "0.3 0.58 0.47",
//       "finish": "shimmer",
//       "coverage": "hi"
//     },
//     "eyeshadow2": {
//       "color": "1.00 0.91 0.27",
//       "finish": "metallic",
//       "coverage": "hi"
//     },
//     "foundation": {
//       "color": "0.95 0.70 0.54",
//       "finish": "natural",
//       "coverage": "mid"
//     },
//     "highlighter": {
//       "color": "0.9 0.80 0.83",
//       "finish": "shimmer",
//       "coverage": 0
//     },
//     "lipstick": {
//       "color": "0.88 0.47 0.61",
//       "finish": "shimmer",
//       "coverage": "hi"
//     },
//     "lipsliner": {
//       "color": "0.99 0.0 0.0",
//       "finish": "shimmer",
//       "coverage": "hi"
//     },
//     "eyelashes": {
//       "color": "0 0 0",
//       "finish": "volume",
//       "coverage": "hi"
//     }
//   }
// )

// setMode("quality")

// Temporary utility helper
const morph = bnb.scene
  .getRoot()
  .findChildByName("lips_morphing")
  .getComponent(bnb.ComponentType.FACE_MORPHING)
  .asFaceMorphing()

const setLipsVolume = (number) => {
  morph.setWeight(number)
  morph.setVisible(number !== 0)
}

// r1 controls liner width, r2 controls softness
const setLipsLinerR1R2 = (r1, r2) => {
  const parameter = bnb.scene.getAssetManager().findMaterial("shaders/smooth/smooth").findParameter("smooth_weights_r1_r2")
  const { x, y, z, w } = parameter.getVector4()
  parameter.setVector4(new bnb.Vec4(x, y, r1, r2))
}

// setState(
//   {
//     "lipsliner": {
//       "color": "0.99 0.0 0.0",
//       "finish": "shimmer",
//       "coverage": "hi"
//     }
//   }
// )

// setLipsLinerR1R2(5, 5)

const setLipsShine = (color, saturation, brightness, shine_intensity, shine_bleeding, shine_scale, glitter_bleeding, glitter_intensity, glitter_grain) => {
  const mat = bnb.scene.getAssetManager().findMaterial("shaders/lipsshine/shiny")
  mat.findParameter("var_lips_color").setVector4(new bnb.Vec4(color[0], color[1], color[2], color[3]))
  mat.findParameter("var_lips_saturation_brightness").setVector4(new bnb.Vec4(saturation, brightness, 0, 0))
  mat.findParameter("var_lips_shine_intensity_bleeding_scale").setVector4(new bnb.Vec4(shine_intensity, shine_bleeding, shine_scale, 0))
  mat.findParameter("var_lips_glitter_bleeding_intensity_grain").setVector4(new bnb.Vec4(glitter_bleeding, glitter_intensity, glitter_grain, 0))
}

// setLipsShine([1,0,0,0.7], 1.5, 1, 1, 0.5, 1, 0, 0, 0)

const setSmoothWeights = (whole_face, under_eyes) => {
  if (under_eyes > 0) {
    bnb.scene.enableRecognizerFeature(bnb.FeatureID.FACE_MESH_CORRECTION)
  }
  const parameter = bnb.scene.getAssetManager().findMaterial("shaders/smooth/smooth").findParameter("smooth_weights_r1_r2")
  const { x, y, z, w } = parameter.getVector4()
  parameter.setVector4(new bnb.Vec4(whole_face, under_eyes, z, w))
}

// setSmoothWeights(1, 0)

const setLipsGlitter = (enabled) => {
  bnb.scene.getAssetManager().findMaterial("shaders/glitter/mat_glitter").findParameter("lips_glitter_enabled").setVector4(new bnb.Vec4(enabled ? 1 : 0, 0, 0, 0))
}

// setLipsGlitter(true)

// smokey_index: 0 - disable smokey eyes, regular eyeshadow masks are used
//               1 - use red channel from contur_smokey_06.png for eyeshadow0 and red channel from shadows_arrows_smokey_06.png for eyeshadow1
//               2 - green channel from contur_smokey_06.png for eyeshadow0 and red channel from shadows_arrows_smokey_06.png for eyeshadow1
//               3 - blue channel from contur_smokey_06.png for eyeshadow0 and red channel from shadows_arrows_smokey_06.png for eyeshadow1
//               4 - alpha channel from contur_smokey_06.png for eyeshadow0 and red channel from shadows_arrows_smokey_06.png for eyeshadow1
const setSmokeyEyes = (smokey_index) => {
  bnb.scene.getAssetManager().findMaterial("shaders/face_tex").findParameter("smokey_eyes_index").setVector4(new bnb.Vec4(smokey_index, 0, 0, 0))
}

Object.assign(globalThis, { setState, setMode, setSmoothWeights, setSmokeyEyes })

// example of smokey eyes mode:
/* 
setSmokeyEyes(1)
setState(
  {
    "eyeshadow0": {
      "color": "0.006, 0.004, 0.002",
      "finish": "matte",
      "coverage": 1.0
    },
    "eyeshadow1": {
      "color": "0.06, 0.04, 0.02",
      "finish": "matte",
      "coverage": 1.0
    }
  }
  )
*/
