#include <bnb/glsl.vert>

BNB_LAYOUT_LOCATION(0) BNB_IN vec3 attrib_pos;
BNB_LAYOUT_LOCATION(2) BNB_IN vec2 attrib_uv;
BNB_LAYOUT_LOCATION(3) BNB_IN vec4 attrib_red_mask;
BNB_OUT(0) float var_mask;

void main()
{
	if( fake_skin_nn_active.x < 0.5 )
	{
		gl_Position = vec4(2.,2.,0.,1.); // skip drawing: move all verts outside of view
		return;
	}
	gl_Position = bnb_MVP * vec4( attrib_pos, 1. );
	var_mask = 1. - (attrib_red_mask.y + attrib_red_mask.z);
}
