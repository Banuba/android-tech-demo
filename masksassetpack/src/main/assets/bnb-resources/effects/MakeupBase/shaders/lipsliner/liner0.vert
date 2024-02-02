#include <bnb/glsl.vert>

layout(location=0) in vec2 attrib_pos;

BNB_OUT(0) vec2 var_uv;

void main()
{
	gl_Position = vec4( attrib_pos.xy, 0., 1. );
	var_uv = attrib_pos.xy*0.5 + 0.5;

#ifdef BNB_VK_1
	var_uv.y = 1. - var_uv.y;
#endif
}
