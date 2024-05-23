#include <bnb/glsl.vert>

layout(location=0) in vec2 attrib_pos;

BNB_OUT(0) float var_scale;

void main()
{
	gl_Position = vec4( attrib_pos.xy, 0., 1. );

	mat4 mvp = bnb_PROJ * bnb_MV_[4];
	vec4 mouth0 = mvp * vec4(-27.3, -55.39, 80.56, 1.);
	vec4 mouth1 = mvp * vec4( 27.3, -55.39, 80.56, 1.);
	vec2 mouth0_view = ((mouth0.xy/mouth0.w)*0.5 + 0.5)*bnb_SCREEN.xy;
	vec2 mouth1_view = ((mouth1.xy/mouth1.w)*0.5 + 0.5)*bnb_SCREEN.xy;
	float mouth_pix_size = length(mouth0_view - mouth1_view);
	var_scale = mouth_pix_size*0.001;
}
