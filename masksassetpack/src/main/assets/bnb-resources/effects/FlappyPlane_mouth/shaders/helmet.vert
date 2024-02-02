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

#define EGG_POS -95., 15., -600.


#define BNB_USE_UVMORPH

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



BNB_DECLARE_SAMPLER_2D(0, 1, bnb_BONES);


BNB_DECLARE_SAMPLER_2D(2, 3, bnb_STATICPOS);

#ifdef BNB_USE_UVMORPH

BNB_DECLARE_SAMPLER_2D(4, 5, bnb_UVMORPH_FISHEYE);
#endif

BNB_OUT(0) vec2 var_uv;
BNB_OUT(1) vec2 var_bg_uv;


#include <bnb/morph_transform.glsl>
#include <bnb/anim_transform.glsl>
#include <bnb/get_bone.glsl>

void main()
{
     mat4 m = bnb_get_transform();

    vec3 vpos = attrib_pos;
    // vpos.xy *= 13.;
    vpos = vec3(vec4(vpos,1.)*m);

#ifdef BNB_USE_UVMORPH
    const float max_range = 40.;
    vec3 translation = BNB_TEXTURE_2D(BNB_SAMPLER_2D(bnb_UVMORPH_FISHEYE), vec3(smoothstep(0.,1.,attrib_uv),float(gl_InstanceID)) ).xyz*(2.*max_range) - max_range;
    vpos += translation;
#endif

    // vpos.z += 20.;

    mat3 mv = mat3(bnb_MV); // only rotational part of transform
    // vpos = mv*vpos;
    // vpos += vec3( EGG_POS );
    vpos.y += hpos.x/14.;

        float mult = 0.02;

    #if defined(BNB_OS_IOS)
        mult = 0.05;
    #endif      

    #if defined(BNB_OS_ANDROID)
        mult = 0.05;

    #endif   

    mat4 mv2 = mat4(
        vec4(bnb_PROJ[0].x*mult, 0., 0., -0.41),
        vec4(0., 0.07, 0., 0.06),
        vec4(0., 0., 1., 0.),
        vec4(0., 0., 0., 1.)
    );
    #ifndef BNB_OS_IOS
        #ifndef BNB_OS_ANDROID
            vpos.x += 0.2/bnb_PROJ[0].x;
        #endif
    #endif


    gl_Position = vec4(vpos,1.) *mv2;

    vec2 flip_uv = attrib_uv;
    #ifndef BNB_VK_1
        flip_uv.y = 1. - flip_uv.y;
    #endif    

    vec3 vpos_original = BNB_TEXTURE_2D(BNB_SAMPLER_2D(bnb_STATICPOS),flip_uv).xyz;
    vec4 vpos_view = bnb_MVP*vec4(vpos_original,1.);
    var_bg_uv = (vpos_view.xy/vpos_view.w)*0.5+0.535;
    #ifdef BNB_VK_1
        var_bg_uv.y = 1. - var_bg_uv.y;
    #endif    

    var_uv = attrib_uv;


}