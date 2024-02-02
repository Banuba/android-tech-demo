#include <bnb/glsl.frag>

BNB_IN(0) vec2 var_uv;
BNB_IN(1) vec2 var_mask_uv;

BNB_DECLARE_SAMPLER_2D(0, 1, tex);

void main()
{
	vec4 c = BNB_TEXTURE_2D_LOD( BNB_SAMPLER_2D(tex), var_uv, 0. );
	// if( c.w > 0. )
	// 	bnb_FragColor = vec4( c.xyz/c.w, 1. );
	// else
	// 	bnb_FragColor = vec4( 0. );
	bnb_FragColor = c;
}
