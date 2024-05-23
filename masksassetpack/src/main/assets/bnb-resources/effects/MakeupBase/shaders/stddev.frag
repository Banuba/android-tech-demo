#include <bnb/glsl.frag>

BNB_IN(0) vec2 var_uv;

BNB_DECLARE_SAMPLER_2D(0, 1, tex_mean_full);
BNB_DECLARE_SAMPLER_2D(2, 3, tex_mean);

void main()
{
	vec4 I_mask = BNB_TEXTURE_2D_LOD( BNB_SAMPLER_2D(tex_mean_full), var_uv, 0. );
	vec4 I_mean_ = texelFetch( BNB_SAMPLER_2D(tex_mean), ivec2(0,0), 8 );
	vec3 I_mean = I_mean_.xyz/max(I_mean_.w,0.00001);
	vec3 I_ = I_mask.xyz;
	float M = I_mask.w;

	vec3 d = I_ - I_mean;
	
	bnb_FragColor = vec4( d*d*M*100.*100., M ); // *100.*100. is to make values bigger to avoid collapsing to 0 during mipmap generation on some Apple HW
}
