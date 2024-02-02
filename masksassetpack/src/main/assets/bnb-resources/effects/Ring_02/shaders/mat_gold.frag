#include <bnb/glsl.frag>

BNB_IN(0) vec2 var_uv;
BNB_IN(1) vec3 var_n;
BNB_IN(2) vec3 var_v;

BNB_DECLARE_SAMPLER_2D(0, 1, tex_diffuse);
BNB_DECLARE_SAMPLER_2D(2, 3, tex_metallic);
BNB_DECLARE_SAMPLER_2D(4, 5, tex_roughness);
BNB_DECLARE_SAMPLER_CUBE(6, 7, tex_ibl_diff);
BNB_DECLARE_SAMPLER_CUBE(8, 9, tex_ibl_spec);


// gamma to linear
vec3 g2l( vec3 g )
{
	return g*(g*(g*0.305306011+0.682171111)+0.012522878);
}

// combined hdr to ldr and linear to gamma
vec3 l2g( vec3 l )
{
	return sqrt(1.33*(1.-exp(-l)))-0.03;
}

vec3 fresnel_schlick_roughness( float prod, vec3 F0, float roughness )
{
	return F0 + ( max( F0, 1. - roughness ) - F0 )*pow( 1. - prod, 5. );
}

vec2 brdf_approx( float Roughness, float NoV )
{
	const vec4 c0 = vec4( -1., -0.0275, -0.572, 0.022 );
	const vec4 c1 = vec4( 1., 0.0425, 1.04, -0.04 );
	vec4 r = Roughness*c0 + c1;
	float a004 = min( r.x*r.x, exp2( -9.28*NoV ) )*r.x + r.y;
	vec2 AB = vec2( -1.04, 1.04 )*a004 + r.zw;
	return AB;
}

void main()
{
	vec4 base_opacity = BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_diffuse), var_uv);

	vec3 base = g2l(base_opacity.xyz);

	// base saturation
	float f_base = 0.0; // desaturate by 20%
    float L_base = 0.3* base.r + 0.6*base.g + 0.1*base.b;
    base.r = base.r + f_base * (L_base - base.r);
    base.g = base.g + f_base * (L_base - base.g);
    base.b = base.b + f_base * (L_base - base.b);  

	float opacity = base_opacity.w;
	float metallic = BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_metallic), var_uv).x;
	float roughness = BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_roughness), var_uv).x;

	vec3 N = normalize( var_n );

	vec3 V = normalize( -var_v );
	float cN_V = max( 0., dot( N, V ) );
	vec3 R = reflect( -V, N );

	vec3 F0 = mix( vec3(0.04), base, metallic );

	vec3 F = fresnel_schlick_roughness( cN_V, F0, roughness );
	vec3 kD = ( 1. - F )*( 1. - metallic );

	vec3 diffuse = BNB_TEXTURE_CUBE(BNB_SAMPLER_CUBE(tex_ibl_diff), N).xyz * base;

	const float MAX_REFLECTION_LOD = 7.; // number of mip levels in tex_ibl_spec
	vec3 prefilteredColor = BNB_TEXTURE_CUBE_LOD(BNB_SAMPLER_CUBE(tex_ibl_spec), R, roughness*MAX_REFLECTION_LOD ).xyz;

	vec2 brdf = brdf_approx( roughness, cN_V );
	vec3 specular = prefilteredColor * (F0*brdf.x + brdf.y);

	//CC fix look
	specular = 1.2  * pow(specular,vec3(1.2));
	diffuse = diffuse;
	kD = kD + 0.0;
	//----------------

	vec3 color = (kD*diffuse + specular);

    
    float f = 0.0; // desaturate by 20%
    float L = 0.3* color.r + 0.6*color.g + 0.1*color.b;
    color.r = color.r + f * (L - color.r);
    color.g = color.g + f * (L - color.g);
    color.b = color.b + f * (L - color.b);   



	bnb_FragColor = vec4(l2g(color),opacity);
    //bnb_FragColor = vec4(1., 0., 0., 1.);
}