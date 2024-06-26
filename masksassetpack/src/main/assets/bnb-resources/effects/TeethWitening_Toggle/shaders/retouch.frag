#include <bnb/glsl.frag>

#define TEETH_WHITENING
#define teethWhiteningCoeff 2.5
// #define EYES_WHITENING
// #define eyesWhiteningCoeff 0.5
// #define EYES_HIGHLIGHT
// #define SOFT_LIGHT_LAYER
// #define SOFT_SKIN
// #define NORMAL_LAYER
// #define skinSoftIntensity 0.7
// #define SHARPEN_TEETH
// #define teethSharpenIntensity 0.2
// #define SHARPEN_EYES
// #define eyesSharpenIntensity 0.3
#define PSI 0.1


BNB_IN(0) vec2 var_uv;
BNB_IN(1) vec2 var_bg_uv;
BNB_IN(2) mat4 sp;


BNB_DECLARE_SAMPLER_2D(0, 1, selection_tex);

BNB_DECLARE_SAMPLER_2D(2, 3, lookupTexTeeth);

BNB_DECLARE_SAMPLER_2D(4, 5, glfx_BACKGROUND);

#if defined(EYES_HIGHLIGHT)

BNB_DECLARE_SAMPLER_2D(10, 11, tex_highlight);
#endif
#ifdef SOFT_LIGHT_LAYER

BNB_DECLARE_SAMPLER_2D(6, 7, tex_softLight);
#endif
#ifdef NORMAL_LAYER

BNB_DECLARE_SAMPLER_2D(8, 9, tex_normalMakeup);
#endif


vec4 textureLookup(vec4 originalColor, BNB_DECLARE_SAMPLER_2D_ARGUMENT(lookupTexture))
{
    const float epsilon = 0.000001;
    const float lutSize = 512.0;

    float blueValue = (originalColor.b * 255.0) / 4.0;

    vec2 mulB = clamp(floor(blueValue) + vec2(0.0, 1.0), 0.0, 63.0);
    vec2 row = floor(mulB / 8.0 + epsilon);
    vec4 row_col = vec4(row, mulB - row * 8.0);
    vec4 lookup = originalColor.ggrr * (63.0 / lutSize) + row_col * (64.0 / lutSize) + (0.5 / lutSize);

    float factor = blueValue - mulB.x;

    vec3 sampled1 = BNB_TEXTURE_2D_LOD(BNB_SAMPLER_2D(lookupTexture), lookup.zx, 0.).rgb;
    vec3 sampled2 = BNB_TEXTURE_2D_LOD(BNB_SAMPLER_2D(lookupTexture), lookup.wy, 0.).rgb;

    vec3 res = mix(sampled1, sampled2, factor);
    return vec4(res, originalColor.a);
}

vec4 whitening(vec4 originalColor, float factor, BNB_DECLARE_SAMPLER_2D_ARGUMENT(lookup)) {
    vec4 color = textureLookup(originalColor, BNB_PASS_SAMPLER_ARGUMENT(lookup));
    return mix(originalColor, color, factor);
}

vec4 sharpen(vec4 originalColor, float factor) {
    vec4 total = 5.0 * originalColor - BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), sp[0].zw) - BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), sp[1].zw) - BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), sp[2].zw) - BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), sp[3].zw);
    vec4 result = mix(originalColor, total, factor);
    return clamp(result, 0.0, 1.0);;
}

vec4 getLuminance4(mat4 color) {
    const vec4 rgb2y = vec4(0.299, 0.587, 0.114, 0.0);
    return rgb2y * color;
}

float getLuminance(vec4 color) {
    const vec4 rgb2y = vec4(0.299, 0.587, 0.114, 0.0);
    return dot(color, rgb2y);
}

vec4 getWeight(float intensity, vec4 nextIntensity) {
    vec4 lglg = log(nextIntensity / intensity) * log(nextIntensity / intensity);
    return exp(lglg / (-2.0 *  PSI  *  PSI ));
}

vec4 softSkin(vec4 originalColor, float factor) {
    vec4 screenColor = originalColor;
    float intensity = getLuminance(screenColor);
    float summ = 1.0;
    
    mat4 nextColor;
    nextColor[0] = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), sp[0].xy);
    nextColor[1] = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), sp[1].xy);
    nextColor[2] = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), sp[2].xy);
    nextColor[3] = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), sp[3].xy);
    vec4 nextIntensity = getLuminance4(nextColor);
    vec4 curr = 0.367 * getWeight(intensity, nextIntensity);
    summ += dot(curr, vec4(1.0));
    screenColor += nextColor * curr;
    screenColor = screenColor / summ;
    
    screenColor = mix(originalColor, screenColor, factor);
    return screenColor;
}

float blendSoftLight(float a, float b) {
    return (a+2.*b*(1.-a))*a;
}

vec3 blendSoftLight(vec3 base, vec3 blend) {
    return vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));
}

vec3 blendSoftLight(vec3 base, vec3 blend, float opacity) {
    return (blendSoftLight(base, blend) * opacity + base * (1.0 - opacity));
}

void main()
{
    vec4 maskColor = BNB_TEXTURE_2D(BNB_SAMPLER_2D(selection_tex), var_uv);
    vec4 res = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), var_bg_uv );
    
#ifdef SOFT_SKIN
    res = softSkin(res, maskColor.r * skinSoftIntensity);
#endif
    
#ifdef SKIN_TEXTURING
    vec4 skinTexture = texture(skin_tex, var_uv);
    vec4 diff = abs(skinTexture - res);
    res = mix(res, diff, skinTexturingIntensity);
#endif
    
#ifdef SHARPEN_TEETH
    res = sharpen(res, maskColor.g * teethSharpenIntensity);
#endif
    
#if defined(TEETH_WHITENING)
    if(toggle.x == 1.){
    res = whitening(res, maskColor.g * teethWhiteningCoeff, BNB_PASS_SAMPLER_ARGUMENT(lookupTexTeeth));

    }
#endif
    
    
#ifdef SHARPEN_EYES
    res = sharpen(res, maskColor.b * eyesSharpenIntensity);
#endif
    
#if defined(EYES_WHITENING)
    res = whitening(res, maskColor.b * eyesWhiteningCoeff, BNB_PASS_SAMPLER_ARGUMENT(lookupTexEyes));
#endif
    
#if defined(EYES_HIGHLIGHT)
    res = res + vec4( BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_highlight), var_uv ).xyz, 0. );
#endif

#ifdef SOFT_LIGHT_LAYER
    res.xyz = blendSoftLight( res.xyz, BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_softLight), var_uv ).xyz );
#endif

#ifdef NORMAL_LAYER
    vec4 makeup2 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(selection_tex), var_uv );
    res.xyz = mix( res.xyz, makeup2.xyz, makeup2.w*0.3 );
#endif

    bnb_FragColor = res;
}