#include <bnb/glsl.vert>

BNB_LAYOUT_LOCATION(0) BNB_IN vec2 attrib_pos;

BNB_OUT(0) vec4 var_brow_uv;
BNB_OUT(1) vec4 var_skin_lips_uv;

void main()
{
	vec2 v = attrib_pos.xy;
	gl_Position = vec4( v, 0., 1. );

	var_brow_uv.xy = vec2(vec4(v,1.,1.) * left_brow_nn_transform);
	var_brow_uv.zw = vec2(vec4(v,1.,1.) * right_brow_nn_transform);
	if( fake_skin_nn_active.x < 0.5 )
		var_skin_lips_uv.xy = vec2(vec4(v,1.,1.) * skin_nn_transform);
	else
		var_skin_lips_uv.xy = vec2(vec4(v,1.,1.) * face_nn_transform);
	var_skin_lips_uv.zw = vec2(vec4(v,1.,1.) * lips_nn_transform);
}
