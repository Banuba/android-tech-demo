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


#define GLFX_LIGHTS
#define GLFX_TBN
#define GLFX_LIGHTING

BNB_LAYOUT_LOCATION(0) BNB_IN vec3 attrib_pos;
#ifdef GLFX_LIGHTING
#ifdef BNB_VK_1
BNB_LAYOUT_LOCATION(1) BNB_IN uint attrib_n;
#else
BNB_LAYOUT_LOCATION(1) BNB_IN vec4 attrib_n;
#endif
#ifdef GLFX_TBN
#ifdef BNB_VK_1
BNB_LAYOUT_LOCATION(2) BNB_IN uint attrib_t;
#else
BNB_LAYOUT_LOCATION(2) BNB_IN vec4 attrib_t;
#endif
#endif
#endif
BNB_LAYOUT_LOCATION(3) BNB_IN vec2 attrib_uv;
#ifndef BNB_GL_ES_1
BNB_LAYOUT_LOCATION(4) BNB_IN uvec4 attrib_bones;
#else
BNB_LAYOUT_LOCATION(4) BNB_IN vec4 attrib_bones;
#endif
#ifndef BNB_1_BONE
BNB_LAYOUT_LOCATION(5) BNB_IN vec4 attrib_weights;
#endif



BNB_DECLARE_SAMPLER_2D(14, 15, bnb_BONES);

#ifdef BNB_USE_UVMORPH

BNB_DECLARE_SAMPLER_2D(16, 17, bnb_UVMORPH_FISHEYE);
#endif

#ifdef GLFX_OCCLUSION
BNB_OUT(5) vec2 glfx_OCCLUSION_UV;
#endif

#ifdef BNB_USE_AUTOMORPH

BNB_DECLARE_SAMPLER_2D(18, 19, bnb_MORPH);
#ifndef BNB_AUTOMORPH_BONE
#else
#endif
#endif

#ifdef BNB_USE_SHADOW

BNB_OUT(6) vec3 var_shadow_coord;
vec3 spherical_proj( vec2 fovM, vec2 fovP, float zn, float zf, vec3 v )
{
    vec2 xy = (atan( v.xy, v.zz )-(fovP+fovM)*0.5)/((fovP-fovM)*0.5);
    float z = (length(v)-(zn+zf)*0.5)/((zf-zn)*0.5);
    return vec3( xy, z );
}
#endif

BNB_OUT(0) vec2 var_uv;
#ifdef GLFX_LIGHTING
#ifdef GLFX_TBN
BNB_OUT(1) vec3 var_t;
BNB_OUT(2) vec3 var_b;
#endif
BNB_OUT(3) vec3 var_n;
BNB_OUT(4) vec3 var_v;
#endif



#include <bnb/morph_transform.glsl>
#include <bnb/get_bone.glsl>
#include <bnb/anim_transform.glsl>
void main()
{
    mat4 m = bnb_get_transform();
    vec3 vpos = attrib_pos;

#ifdef BNB_USE_UVMORPH
    const float max_range = 40.;
    vec3 translation = BNB_TEXTURE_2D(BNB_SAMPLER_2D(bnb_UVMORPH_FISHEYE), vec3(smoothstep(0.,1.,attrib_uv),float(gl_InstanceID)) ).xyz*(2.*max_range) - max_range;
#ifdef GLFX_UVMORPH_Z_UP
    vpos += vec3(translation.x,-translation.z,translation.y);
#else
    vpos += translation;
#endif
#endif

    vpos = vec3(vec4(vpos,1.)*m);

#ifdef BNB_USE_AUTOMORPH
#ifndef BNB_AUTOMORPH_BONE
    vpos = bnb_auto_morph( vpos );
#else
    vpos = bnb_auto_morph( vpos, m );
#endif
#endif

mat4 stat = mat4(
        1., bnb_MV[0][1], bnb_MV[0][2], bnb_MV[0][3],
        bnb_MV[1][0], 1., bnb_MV[1][2], bnb_MV[1][3], 
        0., 0., bnb_MV[2][2], bnb_MV[2][3], 
        bnb_MV[3][0], bnb_MV[3][1], bnb_MV[3][2], bnb_MV[3][3]
    );

    mat4 stat2 = mat4(
        bnb_MV[0][0], bnb_MV[0][1], bnb_MV[0][2], bnb_MV[0][3],
        bnb_MV[1][0], bnb_MV[1][1], bnb_MV[1][2], bnb_MV[1][3], 
        bnb_MV[2][0] / 1.2, bnb_MV[2][1] / 1.8, bnb_MV[2][2], bnb_MV[2][3], 
        bnb_MV[3][0] + bnb_MV[2][0] * 50., bnb_MV[3][1]  + bnb_MV[2][1] * 40., bnb_MV[3][2], bnb_MV[3][3]
    );
    float angle = (bnb_MV[2][1] * 25.);
    float cosA = cos(radians(angle));
    float sinA = sin(radians(angle));


    // vpos.y -= 
    // mat3 rotate_y = mat3(
    //     cosA, 0., sinA,
    //     0., 1., 0.,
    //     -sinA, 0., cosA
    // );
    mat3 rotate_x = mat3(
        1., 0., 0.,
        0., cosA, -sinA,
        0., sinA, cosA
    );

    angle = (-bnb_MV[2][0] * 50.);
    cosA = cos(radians(angle));
    sinA = sin(radians(angle));

    mat3 rotate_y = mat3(
        cosA, 0., sinA,
        0., 1., 0.,
        -sinA, 0., cosA
    );
    vpos.y -= 4.0;
    // vpos.x -= bnb_MV[0][1] * 20.;
    // vpos.y += bnb_MV[0][1] * 100.;
    angle = (bnb_MV[2][1] * 20.);
    cosA = cos(radians(angle));
    sinA = sin(radians(angle));

    mat3 extra_angle_x = mat3(
        1. - 0.0000001 * bnb_MV[2][1] * 10., 0., 0.,
        0., cosA, -sinA,
        0., sinA, cosA
    );

    if(bnb_MV[2][1] > 0.){
        vpos.y += bnb_MV[2][1] * 2.;
        // vpos = vpos * extra_angle_x;
    } else {
        vpos.y -= bnb_MV[2][1] * 25.;
        // vpos = vpos * extra_angle_x;
    }

    gl_Position =  bnb_PROJ *  stat2  * vec4(vpos * rotate_x * rotate_y,1.);
    var_uv = attrib_uv;

#ifdef GLFX_LIGHTING
    var_n = mat3(bnb_MV)*(bnb_decode_int1010102(attrib_n).xyz*mat3(m));
#ifdef GLFX_TBN
    var_t = mat3(bnb_MV)*(bnb_decode_int1010102(attrib_t).xyz*mat3(m));
    var_b = bnb_decode_int1010102(attrib_t).w*cross( var_n, var_t );
#endif
    var_v = (bnb_MV*vec4(vpos,1.)).xyz;
#endif
#ifdef BNB_USE_SHADOW

    var_shadow_coord = spherical_proj(
        vec2(-radians(60.),-radians(20.)),vec2(radians(60.),radians(100.)),
        400.,70.,
        vpos+vec3(0.,100.,50.))*0.5+0.5;
#endif
#ifdef GLFX_OCCLUSION
    glfx_OCCLUSION_UV = (gl_Position.xy / gl_Position.w - glfx_OCCLUSION_RECT.xy) / glfx_OCCLUSION_RECT.zw;
    glfx_OCCLUSION_UV = glfx_OCCLUSION_UV * 0.5 + 0.5;
    glfx_OCCLUSION_UV.y = 1.0 - glfx_OCCLUSION_UV.y;
#endif
}