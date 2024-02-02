#include <bnb/glsl.vert>
#include <bnb/decode_int1010102.glsl>
#include<bnb/matrix_operations.glsl>
#define bnb_IDX_OFFSET 0
#ifdef BNB_VK_1
#ifdef gl_VertexID
#undef gl_VertexID
#endif
#ifdef gl_InstanceID
#undef gl_InstanceID
#endif
#define gl_VertexID gl_VertexIndex
#define gl_InstanceID gl_InstanceIndex
#endif
#define SCALE 2.5


BNB_LAYOUT_LOCATION(0) BNB_IN vec3 attrib_pos;
BNB_LAYOUT_LOCATION(3) BNB_IN vec2 attrib_uv;

BNB_OUT(0) vec2 var_uv;




BNB_DECLARE_SAMPLER_2D(0, 1, tex);

float texture_aspect(BNB_DECLARE_SAMPLER_2D_ARGUMENT(s))
{
	vec2 sz = vec2(textureSize(BNB_SAMPLER_2D(s),0));
	return sz.x/sz.y;
}

void main()
{
    const float x_scale = 0.2 * SCALE;
    const float y_scale = 0.06 * SCALE;
	const vec2 center = vec2(0.,-0.4);

	vec2 quad_size = vec2(x_scale, y_scale*texture_aspect(BNB_PASS_SAMPLER_ARGUMENT(tex))*(bnb_SCREEN.x/bnb_SCREEN.y));
	vec2 vpos = center + attrib_pos.xy*quad_size;
    gl_Position = vec4(vpos, 0., 1.);

    var_uv = attrib_uv;
}