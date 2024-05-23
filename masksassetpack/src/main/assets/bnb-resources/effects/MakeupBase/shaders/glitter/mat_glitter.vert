#include <bnb/glsl.vert>
#include <bnb/decode_int1010102.glsl>
#include<bnb/matrix_operations.glsl>

layout(location = 0) in vec3 attrib_pos;
#if defined(BNB_VK_1)
layout(location = 1) in uint attrib_n;
layout(location = 2) in uint attrib_t;
#else
layout(location = 1) in vec4 attrib_n;
layout(location = 2) in vec4 attrib_t;
#endif
layout(location = 3) in vec2 attrib_uv;
layout(location = 4) in uvec4 attrib_bones;
layout(location = 5) in vec4 attrib_weights;

BNB_DECLARE_SAMPLER_2D(12, 13, bnb_MORPH);

BNB_OUT(0) vec4 var_uv;
BNB_OUT(1) vec3 var_t;
BNB_OUT(2) vec3 var_b;
BNB_OUT(3) vec3 var_n;
BNB_OUT(4) vec3 var_v;

#define BNB_USE_AUTOMORPH
#include <bnb/morph_transform.glsl>

void main()
{
    if( lips_glitter_enabled.x < 0.5 )
    {
        gl_Position = vec4(2.,2.,0.,1.); // skip drawing: move all verts outside of view
        return;
    }

    vec3 vpos = attrib_pos;
    vpos = bnb_auto_morph( vpos );

    gl_Position =  bnb_MVP  * vec4(vpos,1.);

    vec2 bg_uv = (gl_Position.xy / gl_Position.w) * 0.5 + 0.5;
#ifdef BNB_VK_1
    bg_uv.y = 1. - bg_uv.y;
#endif
    var_uv = vec4(attrib_uv, bg_uv);

    mat3 mv0_3 = mat3(bnb_MV[0].xyz, bnb_MV[1].xyz, bnb_MV[2].xyz);

    vec4 attrib_t1 = decode_int1010102(attrib_t);
    vec4 attrib_n1 = decode_int1010102(attrib_n);

    var_t = normalize(mv0_3 * attrib_t1.xyz);
    var_n = normalize(mv0_3 * attrib_n1.xyz);
    var_b = attrib_t1.w * cross(var_n, var_t);
    var_v = (bnb_MV * vec4(vpos, 1.)).xyz;
}