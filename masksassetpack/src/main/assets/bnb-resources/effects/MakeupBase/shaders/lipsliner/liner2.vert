#include <bnb/glsl.vert>

layout(location=0) in vec2 attrib_pos;

void main()
{
	gl_Position = vec4( attrib_pos.xy, 0., 1. );
}
