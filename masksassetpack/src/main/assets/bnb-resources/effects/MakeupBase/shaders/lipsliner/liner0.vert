#include <bnb/glsl.vert>

layout(location=0) in vec2 attrib_pos;

BNB_OUT(0) vec2 var_uv;

void main()
{
	vec2 v = attrib_pos.xy;
	gl_Position = vec4( v, 0., 1. );
	var_uv = vec2(vec4(v,1.,1.) * lips_nn_transform);
}
