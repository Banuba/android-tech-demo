#include <bnb/glsl.frag>


#define eyesWhiteningCoeff 0.8


#define PI 6.28318530718
#define DIRECTIONS 32.0 // BLUR DIRECTIONS (Default 16.0 - More is better but slower)
#define QUALITY 8.0     // BLUR QUALITY (Default 4.0 - More is better but slower)
#define SIZE 50.0        // BLUR SIZE (Radius)


BNB_IN(0) vec2 var_uv;
BNB_IN(1) vec2 var_bg_uv;


BNB_DECLARE_SAMPLER_2D(0, 1, glfx_R_EYE_MASK);
BNB_DECLARE_SAMPLER_2D(2, 3, glfx_R_EYE_CORNEOSCLERA_MASK);
BNB_DECLARE_SAMPLER_2D(4, 5, camera);

BNB_DECLARE_SAMPLER_2D(6, 7, lookupTexEyes);

vec4 blur( BNB_DECLARE_SAMPLER_2D_ARGUMENT(color)){

    vec2 radius = SIZE / bnb_SCREEN.xy;
    vec4 c = BNB_TEXTURE_2D(BNB_SAMPLER_2D(color), var_uv);

    for (float d = 0.0; d < PI; d += PI / DIRECTIONS) {
        for (float i = 1.0 / QUALITY; i <= 1.0; i += 1.0 / QUALITY) {
            c += BNB_TEXTURE_2D(BNB_SAMPLER_2D(color), var_uv + vec2(cos(d), sin(d)) * radius * i);
        }
    }

    c /= QUALITY * DIRECTIONS - 15.0;

    return c;
}

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

void main()
{
	vec4 bg = BNB_TEXTURE_2D(BNB_SAMPLER_2D(camera), var_bg_uv );
	float factor = blur(BNB_PASS_SAMPLER_ARGUMENT(glfx_R_EYE_CORNEOSCLERA_MASK)).x;
	vec4 c = whitening(bg , factor * eyesWhiteningCoeff,  BNB_PASS_SAMPLER_ARGUMENT(lookupTexEyes));
	//c.xyz *= BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_R_EYE_CORNEOSCLERA_MASK), var_uv ).x;
	if(toggle.x == 1.){
		bnb_FragColor = c;

	}else{
		bnb_FragColor = bg;
	}

}
