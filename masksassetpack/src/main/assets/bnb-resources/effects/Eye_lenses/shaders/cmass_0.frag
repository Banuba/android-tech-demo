#include <bnb/glsl.frag>


BNB_IN(0) vec2 var_uv;

BNB_DECLARE_SAMPLER_2D(0, 1, cmass6);

void main()
{
	int x = var_uv.x < 0.5 ? 0 : 2; //int(gl_FragCoord.x)*2;

	vec3 v 
		= BNB_TEXTURE_2D(BNB_SAMPLER_2D(cmass6),vec2(ivec2(x,0))/vec2(4.,2.)).xyz
		+ BNB_TEXTURE_2D(BNB_SAMPLER_2D(cmass6),vec2(ivec2(x+1,0))/vec2(4.,2.)).xyz
		+ BNB_TEXTURE_2D(BNB_SAMPLER_2D(cmass6),vec2(ivec2(x,1))/vec2(4.,2.)).xyz
		+ BNB_TEXTURE_2D(BNB_SAMPLER_2D(cmass6),vec2(ivec2(x+1,1))/vec2(4.,2.)).xyz;

	bnb_FragColor = vec4(vec2(ivec2(v.xy/v.z)), 0., 1.);
}
