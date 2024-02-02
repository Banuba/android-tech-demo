#include <bnb/glsl.vert>
#include <bnb/decode_int1010102.glsl>
#define bnb_IDX_OFFSET 0
#ifdef BNB_VK_1
#define gl_VertexID gl_VertexIndex
#define gl_InstanceID gl_InstanceIndex
#endif


// #define GLFX_IBL
// #define GLFX_TBN
// #define GLFX_TEX_MRAO
// #define GLFX_LIGHTING

#define TAP_VIDEO_SCALE 2.0 // Scale the size of the Arm
#define Z_VIDEO_POS -650. // Set the Arm's z-position
#define Y_VIDEO_POS 100. // Set the Arm's y-position

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
#ifndef GLFX_1_BONE
BNB_LAYOUT_LOCATION(5) BNB_IN vec4 attrib_weights;
#endif




BNB_DECLARE_SAMPLER_2D(0, 1, bnb_BONES);

#ifdef GLFX_USE_UVMORPH

BNB_DECLARE_SAMPLER_2D_ARRAY(2, 3, bnb_UVMORPH_FISHEYE);
#endif

#ifdef GLFX_OCCLUSION
BNB_OUT(1) vec2 glfx_OCCLUSION_UV;
#endif

#ifdef GLFX_USE_AUTOMORPH

BNB_DECLARE_SAMPLER_2D(4, 5, bnb_MORPH);
vec2 glfx_morph_coord( vec3 v )
{
    const float half_angle = radians(104.);
    const float y0 = -110.;
    const float y1 = 112.;
    float x = atan( v.x, v.z )/half_angle;
    float y = ((v.y-y0)/(y1-y0))*2. - 1.;
    return vec2(x,y);
}
#ifndef GLFX_AUTOMORPH_BONE
vec3 glfx_auto_morph( vec3 v )
{
    vec2 morph_uv = glfx_morph_coord(v)*0.5 + 0.5;
    vec3 translation = BNB_TEXTURE_2D(BNB_SAMPLER_2D(bnb_MORPH), morph_uv ).xyz;
    return v + translation;
}
#else
vec3 glfx_auto_morph_bone( vec3 v, mat3x4 m )
{
    vec2 morph_uv = glfx_morph_coord(vec3(m[0][3],m[1][3],m[2][3]))*0.5 + 0.5;
    vec3 translation = BNB_TEXTURE_2D(BNB_SAMPLER_2D(bnb_MORPH), morph_uv ).xyz;
    return v + translation;
}
#endif
#endif

#ifdef GLFX_USE_SHADOW
BNB_OUT(2) vec3 var_shadow_coord;
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
BNB_OUT(3) vec3 var_t;
BNB_OUT(4) vec3 var_b;
#endif
BNB_OUT(5) vec3 var_n;
BNB_OUT(6) vec3 var_v;
#endif

mat3x4 get_bone( uint bone_idx, int y )
{
    int b = int(bone_idx)*3;
    mat3x4 m = mat3x4( 
        texelFetch(BNB_SAMPLER_2D(bnb_BONES), ivec2(b,y), 0 ),
        texelFetch(BNB_SAMPLER_2D(bnb_BONES), ivec2(b+1,y), 0 ),
        texelFetch(BNB_SAMPLER_2D(bnb_BONES), ivec2(b+2,y), 0 ) );
    return m;
}

mat3x4 get_transform()
{
    int y = int(bnb_ANIMKEY);
    mat3x4 m = get_bone( attrib_bones[0], y );
#ifndef GLFX_1_BONE
    if( attrib_weights[1] > 0. )
    {
        m = m*attrib_weights[0] + get_bone( attrib_bones[1], y )*attrib_weights[1];
        if( attrib_weights[2] > 0. )
        {
            m += get_bone( attrib_bones[2], y )*attrib_weights[2];
            if( attrib_weights[3] > 0. )
                m += get_bone( attrib_bones[3], y )*attrib_weights[3];
        }
    }
#endif
    return m;
}

void main()
{
    mat3x4 m = get_transform();
    vec3 vpos = attrib_pos;

#ifdef GLFX_USE_UVMORPH
    const float max_range = 40.;
    vec3 translation = BNB_TEXTURE_2D_ARRAY(BNB_SAMPLER_2D_ARRAY(bnb_UVMORPH_FISHEYE), vec3(smoothstep(0.,1.,attrib_uv),float(gl_InstanceID)) ).xyz*(2.*max_range) - max_range;
#ifdef GLFX_UVMORPH_Z_UP
    vpos += vec3(translation.x,-translation.z,translation.y);
#else
    vpos += translation;
#endif
#endif

    vpos = vec4(vpos,1.)*m;

#ifdef GLFX_USE_AUTOMORPH
#ifndef GLFX_AUTOMORPH_BONE
    vpos = glfx_auto_morph( vpos );
#else
    vpos = glfx_auto_morph_bone( vpos, m );
#endif
#endif
    // vpos.y += bpos.x/30.;
    mat3 m3 = mat3(bnb_MV);
    vpos = m3*vpos;

    float mult = 0.05;

    #if defined(BNB_OS_IOS)
        mult = 0.1;
    #endif      

    #if defined(BNB_OS_ANDROID)
        mult = 0.1;

    #endif   

    mat4 mv2 = mat4(
        vec4(bnb_PROJ[0].x*mult, 0., 0., -0.4),
        vec4(0., 0.15, 0., bpos.x/200. - 0.04),
        vec4(0., 0., 1., 0.),
        vec4(0., 0., 0., 1.)
    );



    gl_Position = vec4(vpos,1.) * mv2;

    var_uv = attrib_uv;

}