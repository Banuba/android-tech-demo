#include <bnb/glsl.vert>
#include <bnb/decode_int1010102.glsl>
#define bnb_IDX_OFFSET 0
#ifdef BNB_VK_1
#define gl_VertexID gl_VertexIndex
#define gl_InstanceID gl_InstanceIndex
#endif


BNB_LAYOUT_LOCATION(0) BNB_IN vec3 attrib_pos;
BNB_LAYOUT_LOCATION(3) BNB_IN vec2 attrib_uv;
#ifndef BNB_GL_ES_1
BNB_LAYOUT_LOCATION(4) BNB_IN uvec4 attrib_bones;
#else
BNB_LAYOUT_LOCATION(4) BNB_IN vec4 attrib_bones;
#endif



BNB_DECLARE_SAMPLER_2D(2, 3, bnb_BONES);

BNB_OUT(0) vec2 var_uv;

mat3x4 get_bone( uint bone_idx, float k )
{
	float bx = float( int(bone_idx)*3 );
	vec2 rts = 1./vec2(textureSize(BNB_SAMPLER_2D(bnb_BONES),0));
	return mat3x4( 
		BNB_TEXTURE_2D(BNB_SAMPLER_2D(bnb_BONES), (vec2(bx,k)+0.5)*rts ),
		BNB_TEXTURE_2D(BNB_SAMPLER_2D(bnb_BONES), (vec2(bx+1.,k)+0.5)*rts ),
		BNB_TEXTURE_2D(BNB_SAMPLER_2D(bnb_BONES), (vec2(bx+2.,k)+0.5)*rts ) );
}

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

void main()
{
	mat3x4 m = get_bone( attrib_bones[0], bnb_ANIMKEY );

	vec3 vpos = attrib_pos;

	vec3 eye = -bnb_MV[3].xyz;
	vec3 pivot = vec3(m[0].w,m[1].w,m[2].w);

	mat3 billboard_rotation = shortest_arc_m3( 
		vec3(0.,0.,1.), 
		normalize(eye-pivot)*mat3(bnb_MV) );
	vpos = vec4(billboard_rotation*vpos,1.)*m;

	gl_Position = bnb_MVP * vec4(vpos,1.);

	
#ifndef BNB_VK_1
gl_Position.z = -1.;
#else
gl_Position.z = 0.;
#endif


    vec2 uv = attrib_uv;

    uv.y *= js_uv.y;
    uv.y += js_uv.w;
    uv.x *= js_uv.x;
    uv.x += js_uv.z;

    var_uv = uv;
}
