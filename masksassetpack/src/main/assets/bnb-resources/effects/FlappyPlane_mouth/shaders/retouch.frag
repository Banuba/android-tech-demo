#include <bnb/glsl.frag>

#define TEETH_WHITENING
#define teethWhiteningCoeff 1.0
#define EYES_WHITENING
#define eyesWhiteningCoeff 0.5
#define SOFT_LIGHT_LAYER
#define SOFT_SKIN
#define skinSoftIntensity 0.7
#define SHARPEN_TEETH
#define teethSharpenIntensity 0.2
#define SHARPEN_EYES
#define eyesSharpenIntensity 0.3
#define PSI 0.1


BNB_IN(0) vec2 var_uv;
BNB_IN(1) vec2 var_bg_uv;
BNB_IN(2+0) vec4 sp0;
BNB_IN(2+1) vec4 sp1;
BNB_IN(2+2) vec4 sp2;
BNB_IN(2+3) vec4 sp3;



BNB_DECLARE_SAMPLER_2D(0, 1, glfx_BACKGROUND);


#define textureLookup BNB_TEXTURE_LUT


BNB_IN(6) vec3 var_left_right;

void main()
{
    vec4 res = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), var_bg_uv );

    bnb_FragColor = res;
}
