#include <bnb/glsl.frag>

BNB_IN(0) float var_mask;

void main()
{
	bnb_FragColor = vec4( var_mask, 1., 1., 1. );
}
