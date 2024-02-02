#include <bnb/glsl.vert>

BNB_LAYOUT_LOCATION(0) BNB_IN vec3 attrib_pos;
BNB_LAYOUT_LOCATION(1) BNB_IN vec2 attrib_uv;
BNB_LAYOUT_LOCATION(2) BNB_IN vec3 attrib_len_vec;

BNB_OUT(0) vec2 var_uv;

invariant gl_Position;

void main()
{
    vec3 v = attrib_pos + attrib_len_vec * eyelashes_len_coef[0];
    gl_Position = bnb_MVP * vec4(v, 1.);
    var_uv = attrib_uv;
}