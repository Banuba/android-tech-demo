#include <bnb/glsl.frag>


BNB_IN(0) vec2 var_uv;



BNB_DECLARE_SAMPLER_2D(0, 1, tex_diff);

void main()
{
	vec2 uv = var_uv;
	vec3 rgb = BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_diff),uv).xyz;
	float a = BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_diff),uv).a;
	bnb_FragColor = vec4(rgb,a);
}
