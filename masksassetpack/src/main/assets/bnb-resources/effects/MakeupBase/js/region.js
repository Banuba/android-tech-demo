const assets = bnb.scene.getAssetManager()
const DummyVector4 = {
  x: 0,
  y: 0,
  z: 0,
  w: 0,
}
const DummyParameter = {
  getName() {
    return "DummyParameter"
  },
  getVector4() {
    return DummyVector4
  },
  setVector4() {
    return // do nothing
  },
}
class FaceRegion {
  constructor(name, segmentationMasks = []) {
    this._name = name
    this._abcd = DummyParameter
    this._krp = DummyParameter
    this._rgb_maxa = DummyParameter
    this._len_coef = DummyParameter
    this._nns = []
    this._texture = null

    const materialName = `shaders/${this._name}/tone`
    const material = assets.findMaterial(materialName)
    if (!material) {
      bnb.log(`[WARN] Unable to find material "${materialName}"`)
      return
    }

    for (const segmentationMask of segmentationMasks) {
      const nn = assets.findImage(segmentationMask)?.asSegmentationMask()
      if (nn) this._nns.push(nn)
    }

    const parameters = material.getParameters()
    const abcd = parameters.find((parameter) => parameter.getName().endsWith("_abcd")) // e.g. "tone_abcd"
    const krp = parameters.find((parameter) => parameter.getName().endsWith("_krp")) // e.g. "tone_krp"
    const rgb_maxa = parameters.find((parameter) => parameter.getName().endsWith("_rgb_maxa")) // e.g. "tone_rgb_maxa"
    const len_coef = parameters.find((parameter) => parameter.getName().endsWith("_len_coef")) // e.g. "tone_len_coef"

    if (abcd) {
      this._abcd = abcd
      // bnb.log(`[DEBUG] Found the "${this._name}" ABCD parameter is "${abcd.getName()}"`)
    } else bnb.log(`[WARN] Unable to find parameter "*_abcd" of the material "${materialName}"`)
    if (krp) {
      this._krp = krp
      // bnb.log(`[DEBUG] Found the "${this._name}" KRP parameter is "${krp.getName()}"`)
    } else bnb.log(`[WARN] Unable to find parameter "*_krp" of the material "${materialName}"`)
    if (rgb_maxa) {
      this._rgb_maxa = rgb_maxa
      // bnb.log(`[DEBUG] Found the "${this._name}" RGB_MAXA parameter is "${rgb_maxa.getName()}"`)
    } else bnb.log(`[WARN] Unable to find parameter "*_rgb_maxa" of the material "${materialName}"`)
    if (len_coef) {
      this._len_coef = len_coef
    }

    this._texture = assets.findImage(`${name}_tex`)?.asTexture()

    this.clear()
  }
  color(rgb) {
    const [x, y, z] = rgb.split(" ").map((c) => parseFloat(c))
    const { w } = this._rgb_maxa.getVector4()
    this._rgb_maxa.setVector4(new bnb.Vec4(x, y, z, w))
    // bnb.log(`[DEBUG] Set "${this._name}" color to [${x}, ${y}, ${z}, ${w}]`)
    this._show()
  }
  parameters({ A, C, K, R, P, length }) {
    const { x: a, y: b, z: c, w: d } = this._abcd.getVector4()
    if (typeof A === "undefined") A = a
    if (typeof C === "undefined") C = c
    this._abcd.setVector4(new bnb.Vec4(A, b, C, d))
    // bnb.log(`[DEBUG] Set "${this._name}" ABCD parameters to [${a}, ${b}, ${c}, ${d}]`)
    const { x: k, y: r, z: p, w: _ } = this._krp.getVector4()
    if (typeof K === "undefined") K = k
    if (typeof R === "undefined") R = r
    if (typeof P === "undefined") P = p
    this._krp.setVector4(new bnb.Vec4(K, R, P, _))
    // bnb.log(`[DEBUG] Set "${this._name}" KRP parameters to [${k}, ${r}, ${p}]`)
    if (typeof length !== "undefined") this._len_coef.setVector4(new bnb.Vec4(length, 0, 0, 0))
    this._show()
  }
  texture(filepath) {
    this._texture?.load(filepath)
    this._show()
  }
  clear() {
    this._hide()
  }
  isVisible() {
    return this._krp.getVector4().w != 0
  }
  _show() {
    const { x, y, z } = this._krp.getVector4()
    this._krp.setVector4(new bnb.Vec4(x, y, z, 1))
    for (const nn of this._nns) nn.setActive(true)
    // bnb.log(`[DEBUG] Shown "${this._name}"`)
  }
  _hide() {
    const { x, y, z } = this._krp.getVector4()
    this._krp.setVector4(new bnb.Vec4(x, y, z, 0))
    for (const nn of this._nns) nn.setActive(false)
    // bnb.log(`[DEBUG] Hidden "${this._name}"`)
  }
}
exports.FaceRegion = FaceRegion
