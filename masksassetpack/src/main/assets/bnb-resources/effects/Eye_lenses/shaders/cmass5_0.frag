#include <bnb/glsl.frag>

BNB_IN(0) vec2 var_uv;


BNB_DECLARE_SAMPLER_2D(0, 1, cmass5);

void main()
{
	float x = float(int(var_uv.x*4.)*2);
	float y = float(int(var_uv.y*2.)*2);

	vec3 v 
		= BNB_TEXTURE_2D(BNB_SAMPLER_2D(cmass5),vec2(x,y)/vec2(8.,4.)).xyz
		+ BNB_TEXTURE_2D(BNB_SAMPLER_2D(cmass5),vec2(x+1.,y)/vec2(8.,4.)).xyz
		+ BNB_TEXTURE_2D(BNB_SAMPLER_2D(cmass5),vec2(x,y+1.)/vec2(8.,4.)).xyz
		+ BNB_TEXTURE_2D(BNB_SAMPLER_2D(cmass5),vec2(x+1.,y+1.)/vec2(8.,4.)).xyz;

	bnb_FragColor = vec4(v,0.);
}
