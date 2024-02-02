#include <bnb/glsl.frag>

BNB_IN(0) vec2 var_uv;


BNB_DECLARE_SAMPLER_2D(0, 1, cmass3);

void main()
{
	float x = float(int(var_uv.x*16.)*2);
	float y = float(int(var_uv.y*8.)*2);

	vec3 v 
		= BNB_TEXTURE_2D(BNB_SAMPLER_2D(cmass3),vec2(x,y)/vec2(32.,16.)).xyz
		+ BNB_TEXTURE_2D(BNB_SAMPLER_2D(cmass3),vec2(x+1.,y)/vec2(32.,16.)).xyz
		+ BNB_TEXTURE_2D(BNB_SAMPLER_2D(cmass3),vec2(x,y+1.)/vec2(32.,16.)).xyz
		+ BNB_TEXTURE_2D(BNB_SAMPLER_2D(cmass3),vec2(x+1.,y+1.)/vec2(32.,16.)).xyz;

	bnb_FragColor = vec4(v,0.);
}
