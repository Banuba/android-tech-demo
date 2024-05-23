#include <bnb/glsl.frag>

BNB_DECLARE_SAMPLER_2D(0, 1, lips_mask);

BNB_IN(0) vec2 var_uv;

void main()
{
	float m = textureLod(BNB_SAMPLER_2D(lips_mask),var_uv,0.).x;
	bnb_FragColor = vec4(m,0.,0.,0.);
}
