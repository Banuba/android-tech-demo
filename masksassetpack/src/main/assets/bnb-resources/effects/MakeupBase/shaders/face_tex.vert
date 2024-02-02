#include <bnb/glsl.vert>

BNB_LAYOUT_LOCATION(0) BNB_IN vec3 attrib_pos;
BNB_LAYOUT_LOCATION(2) BNB_IN vec2 attrib_uv;
BNB_OUT(0) vec4 var_uv;
BNB_OUT(1) vec2 var_face_uv;

void main()
{
	gl_Position = bnb_MVP * vec4( attrib_pos, 1. );
	vec2 v = gl_Position.xy/gl_Position.w;
	vec2 mask_uv = v*0.5 + 0.5;
#ifdef BNB_VK_1
	mask_uv.y = 1. - mask_uv.y;
#endif
	var_uv = vec4(attrib_uv, mask_uv);
	var_face_uv = vec2(vec4(v,1.,1.) * face_nn_transform);
}
