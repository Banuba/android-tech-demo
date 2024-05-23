#include <bnb/glsl.vert>

BNB_LAYOUT_LOCATION(0) BNB_IN vec3 attrib_pos;
BNB_LAYOUT_LOCATION(2) BNB_IN vec2 attrib_uv;
BNB_LAYOUT_LOCATION(3) BNB_IN vec4 attrib_red_mask;
BNB_OUT(0) float var_mask;

void main()
{
	gl_Position = bnb_MVP * vec4( attrib_pos, 1. );
	var_mask = attrib_red_mask.y;
}
