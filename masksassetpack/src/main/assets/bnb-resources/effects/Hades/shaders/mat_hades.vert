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


#define MORPH_MULTIPLIER 1.0
#define UNITS_MULTIPLIER 0.0

#define GLFX_TBN
#define GLFX_LIGHTING
#define BNB_USE_AUTOMORPH

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
#ifdef GLFX_MALI_VERTEX_ID_ATTRIB
BNB_LAYOUT_LOCATION(6) BNB_IN uint attrib_vertex_id;
#endif



BNB_DECLARE_SAMPLER_2D(16, 17, bnb_BONES);


BNB_DECLARE_SAMPLER_2D_ARRAY(14, 15, tex_blend_shapes);


BNB_DECLARE_SAMPLER_2D(18, 19, bnb_MORPH);

BNB_OUT(0) vec2 var_uv;
#ifdef GLFX_LIGHTING
#ifdef GLFX_TBN
BNB_OUT(1) vec3 var_t;
BNB_OUT(2) vec3 var_b;
#endif
BNB_OUT(3) vec3 var_n;
BNB_OUT(4) vec3 var_v;
#endif



mat3 shortest_arc_m3( vec3 from, vec3 to )
{
    vec3 a = cross( from, to );
    float c = dot( from, to );

    float t = 1./(1.+c);
    float tx = t*a.x;
    float ty = t*a.y;
    float tz = t*a.z;
    float txy = tx*a.y;
    float txz = tx*a.z;
    float tyz = ty*a.z;

    return mat3
    (
        c + tx*a.x, txy + a.z, txz - a.y,
        txy - a.z, c + ty*a.y, tyz + a.x,
        txz + a.y, tyz - a.x, c + tz*a.z
    );
}
#include <bnb/morph_transform.glsl>

#ifdef BNB_GL_ES_1

mat4 get_bone_autobone(float b, float db)
{
    vec4 v0 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(bnb_BONES), vec2(b, 0.));
    vec4 i0 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(bnb_BONES), vec2(b, 1.));
    b += db;
    vec4 v1 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(bnb_BONES), vec2(b, 0.));
    vec4 i1 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(bnb_BONES), vec2(b, 1.));
    b += db;
    vec4 v2 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(bnb_BONES), vec2(b, 0.));
    vec4 i2 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(bnb_BONES), vec2(b, 1.));

    mat4 m = transpose( mat4(v0, v1, v2, vec4(0., 0., 0., 1.)) );

    vec2 morph_uv = bnb_morph_coord(m[3].xyz)*0.5 + 0.5;
    vec3 translation = BNB_TEXTURE_2D(BNB_SAMPLER_2D(bnb_MORPH), morph_uv).xyz;
    m[3].xyz += translation*MORPH_MULTIPLIER;

    mat4 ibp = transpose( mat4(i0, i1, i2, vec4(0., 0., 0., 1.)) );

    return m*ibp;
}

mat4 get_transform_autobone()
{
    float db = 1. / (bnb_ANIM.z * 3.);
    mat4 m = get_bone_autobone(attrib_bones[0], db);

    if (attrib_weights[1] > 0.) {
        m = m * attrib_weights[0] + get_bone_autobone(attrib_bones[1], db) * attrib_weights[1];

        if (attrib_weights[2] > 0.) {
            m += get_bone_autobone(attrib_bones[2], db) * attrib_weights[2];

            if (attrib_weights[3] > 0.) {
                m += get_bone_autobone(attrib_bones[3], db) * attrib_weights[3];
            }
        }
    }

    return m;
}

#else

mat4 get_bone_autobone(uint bone_idx)
{
    int b = int(bone_idx)*3;
    mat4 m = transpose( mat4(
        texelFetch( BNB_SAMPLER_2D(bnb_BONES), ivec2(b,0), 0 ),
        texelFetch( BNB_SAMPLER_2D(bnb_BONES), ivec2(b+1,0), 0 ),
        texelFetch( BNB_SAMPLER_2D(bnb_BONES), ivec2(b+2,0), 0 ),
        vec4(0.,0.,0.,1.) ) );

    vec2 morph_uv = bnb_morph_coord(m[3].xyz)*0.5 + 0.5;
#ifdef BNB_VK_1
    morph_uv.y = 1. - morph_uv.y;
#endif
    vec3 translation = BNB_TEXTURE_2D(BNB_SAMPLER_2D(bnb_MORPH), morph_uv).xyz;
    m[3].xyz += translation*MORPH_MULTIPLIER;

    mat4 ibp = transpose( mat4(
        texelFetch( BNB_SAMPLER_2D(bnb_BONES), ivec2(b,1), 0 ),
        texelFetch( BNB_SAMPLER_2D(bnb_BONES), ivec2(b+1,1), 0 ),
        texelFetch( BNB_SAMPLER_2D(bnb_BONES), ivec2(b+2,1), 0 ),
        vec4(0.,0.,0.,1.) ) );

    return m*ibp;
}

mat4 get_transform_autobone()
{
    mat4 m = get_bone_autobone( attrib_bones[0] );
    if( attrib_weights[1] > 0. )
    {
        m = m*attrib_weights[0] + get_bone_autobone( attrib_bones[1] )*attrib_weights[1];
        if( attrib_weights[2] > 0. )
        {
            m += get_bone_autobone( attrib_bones[2] )*attrib_weights[2];
            if( attrib_weights[3] > 0. )
                m += get_bone_autobone( attrib_bones[3] )*attrib_weights[3];
        }
    }
    return m;
}

#endif     // BNB_GL_ES_1

void main()
{
    mat4 m = get_transform_autobone();

    vec3 vpos = vec3(vec4(attrib_pos,1.)*m);

#ifdef GLFX_LIGHTING
    vec3 vn = mat3(m)*bnb_decode_int1010102(attrib_n).xyz;
#endif

#ifdef GLFX_MALI_VERTEX_ID_ATTRIB
    int vertex_idx = int(attrib_vertex_id) - int(bnb_IDX_OFFSET);
#else
    int vertex_idx = gl_VertexID - int(bnb_IDX_OFFSET);
#endif
    ivec2 bs_p_uv = ivec2((vertex_idx&31)<<1,vertex_idx>>5);
#ifdef GLFX_LIGHTING
    ivec2 bs_n_uv = ivec2(bs_p_uv.x+1,bs_p_uv.y);
#endif

    int au_size = textureSize(BNB_SAMPLER_2D_ARRAY(tex_blend_shapes), 0 ).z;
    for( int i = 0; i != au_size; ++i )
    {
        float bs_w = bnb_AU[i>>2][i&3];
        if( bs_w != 0. )
        {
            vec3 bs_p_delta = texelFetch(BNB_SAMPLER_2D_ARRAY(tex_blend_shapes), ivec3(bs_p_uv,i), 0 ).xyz*bs_w;
            vpos += bs_p_delta;
#ifdef GLFX_LIGHTING
            vec3 bs_n_delta = texelFetch(BNB_SAMPLER_2D_ARRAY(tex_blend_shapes), ivec3(bs_n_uv,i), 0 ).xyz*bs_w;
            vn += bs_n_delta;
#endif
        }
    }
    
    gl_Position = bnb_MVP * vec4(vpos,1.);

    var_uv = attrib_uv;

#ifdef GLFX_LIGHTING
    vn = normalize(vn);
    var_n = mat3(bnb_MV)*vn;
#ifdef GLFX_TBN
    vec3 vt = shortest_arc_m3(bnb_decode_int1010102(attrib_n).xyz,vn)*bnb_decode_int1010102(attrib_t).xyz;
    var_t = mat3(bnb_MV)*vt;
    var_b = bnb_decode_int1010102(attrib_t).w*cross( var_n, var_t );
#endif
    var_v = (bnb_MV*vec4(vpos,1.)).xyz;
#endif

}