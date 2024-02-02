#include <bnb/glsl.frag>


#define Y_OFFSET 0.3
#define Y_SCALE 0.12
#define X_OFFSET 0.1
#define X_SCALE 0.5
BNB_IN(0) vec2 var_uv;
BNB_IN(1) float index;


BNB_DECLARE_SAMPLER_2D(6, 7, bd1);
BNB_DECLARE_SAMPLER_2D(8, 9, bd2);
BNB_DECLARE_SAMPLER_2D(10, 11, bd3);


void main()
{	

	vec2 uv = var_uv;
	vec4 image;
	float i = index;

	if(i == 0. || i == 3.){
		image = BNB_TEXTURE_2D(BNB_SAMPLER_2D(bd1),uv);

	}
	if(i == 1.|| i == 4.){
		image = BNB_TEXTURE_2D(BNB_SAMPLER_2D(bd2),uv);

	}
	if(i == 2.|| i == 5.){
		image = BNB_TEXTURE_2D(BNB_SAMPLER_2D(bd3),uv);

	}
	bnb_FragColor = image;
	bnb_FragColor.a *= 0.3;

}
