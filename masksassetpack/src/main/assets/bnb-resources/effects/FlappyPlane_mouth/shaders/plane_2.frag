#include <bnb/glsl.frag>


#define Y_OFFSET 0.3
#define Y_SCALE 0.12
#define X_OFFSET 0.1
#define X_SCALE 0.5
BNB_IN(0) vec2 var_uv;
BNB_DECLARE_SAMPLER_2D(6, 7, plane);

void main()
{	
	vec2 uv = var_uv;
	// uv.y = 1. - uv.y;
	vec4 image = BNB_TEXTURE_2D(BNB_SAMPLER_2D(plane),uv);


	bnb_FragColor = image;
	// bnb_FragColor = vec4(1.);

}
