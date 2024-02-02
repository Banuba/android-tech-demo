#include <bnb/glsl.frag>

BNB_IN(0) vec2 var_uv;

BNB_DECLARE_SAMPLER_2D(0, 1, tex_blur_hsv);
BNB_DECLARE_SAMPLER_2D(2, 3, tex_mask);

void main()
{
	vec4 I_ = BNB_TEXTURE_2D_LOD( BNB_SAMPLER_2D(tex_blur_hsv), var_uv, 0. );
	
	// float max_a = PARAM_RGB_MAXA.w;
	// float M = step( 0.5*max_a, BNB_TEXTURE_2D_LOD( BNB_SAMPLER_2D(tex_mask), var_uv, 0. )[PARAM_MASK_CHAN] );

	// binarized mask is stored here by blur_hsv shader, 
	// this way we don't need per-feature PARAM_* in this shader so it can be the same for all features
	float M = step( 0.5, I_.w ); // step is to re-binarize after texture filtering

	bnb_FragColor = vec4( I_.xyz*M, M );
}
