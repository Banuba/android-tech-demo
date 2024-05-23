#include <bnb/glsl.frag>


#define GLFX_LIGHTS
#define GLFX_TBN
#define GLFX_IBL
#define GLFX_LIGHTING
#define BNB_USE_AUTOMORPH
#define LIGHT_COLOR vec3(0.8,2.0,2.5)
#define LIGHT_POWER 7.0
#define GLITTER_ROUGHNESS 0.12
#define GLITTER_GAMMA 1.5
#define GLITTER_SCALE 1.0

BNB_IN(0) vec4 var_uv;
BNB_IN(1) vec3 var_t;
BNB_IN(2) vec3 var_b;
BNB_IN(3) vec3 var_n;
BNB_IN(4) vec3 var_v;

BNB_DECLARE_SAMPLER_2D(0, 1, tex_diffuse);
BNB_DECLARE_SAMPLER_2D(2, 3, tex_normal);
BNB_DECLARE_SAMPLER_2D(4, 5, camera);
BNB_DECLARE_SAMPLER_CUBE(6, 7, tex_ibl_diff);
BNB_DECLARE_SAMPLER_CUBE(8, 9, tex_ibl_spec);
BNB_DECLARE_SAMPLER_2D(10, 11, tex_lips_mask);

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

vec3 fresnel_schlick( float prod, vec3 F0 )
{
    return F0 + ( 1. - F0 )*pow( 1. - prod, 5. );
}

vec3 fresnel_schlick_roughness( float prod, vec3 F0, float roughness )
{
    return F0 + ( max( F0, 1. - roughness ) - F0 )*pow( 1. - prod, 5. );
}

vec2 brdf_approx(float Roughness, float NoV)
{
    const vec4 c0 = vec4(-1., -0.0275, -0.572, 0.022);
    const vec4 c1 = vec4(1., 0.0425, 1.04, -0.04);
    vec4 r = Roughness * c0 + c1;
    float a004 = min(r.x * r.x, exp2(-9.28 * NoV)) * r.x + r.y;
    vec2 AB = vec2(-1.04, 1.04) * a004 + r.zw;
    return AB;
}

float distribution_GGX( float cN_H, float roughness )
{
    float a = roughness*roughness;
    float a2 = a*a;
    float d = cN_H*cN_H*( a2 - 1. ) + 1.;
    return a2/(3.14159265*d*d);
}

float geometry_schlick_GGX( float NV, float roughness )
{
    float r = roughness + 1.;
    float k = r*r/8.;
    return NV/( NV*( 1. - k ) + k );
}

float geometry_smith( float cN_L, float ggx2, float roughness )
{
    return geometry_schlick_GGX( cN_L, roughness )*ggx2;
}

float diffuse_factor( float n_l, float w )
{
    float w1 = 1. + w;
    return pow( max( 0., n_l + w )/w1, w1 );
}

void main()
{
#ifdef GLFX_LIGHTS


    ivec2 n_lights = ivec2(4, 3);
    vec3 l_pos = vec3(0.0, 30.0 ,500.0);
    vec2 l_size = vec2(1500.0,500.0);
    int l_array = n_lights.x * n_lights.y;

	vec3 radiance[36];
    for( int i = 0; i != l_array; ++i )
    {
        radiance[i] = LIGHT_POWER * LIGHT_COLOR * 0.05;
    }
    
	//radiance[0] = vec3(1.,1.,1.)*0.6;
	//radiance[1] = vec3(1.,1.,1.)*0.6;
	//radiance[2] = vec3(1.,1.,1.)*0.4;
	//radiance[3] = vec3(1.,1.,0.85)*0.6;    
#endif
#ifdef GLFX_LIGHTS
	vec4 lights[36];
    for( int i = 0; i != l_array; ++i )
    {
        int row = i / n_lights.x;
        int col = i % n_lights.x;

        float l_x = (l_pos.x - (l_size.x/2.0)) + (float(col) * l_size.x / float(n_lights.x));
        float l_y = (l_pos.y - (l_size.y/2.0)) + (float(row) * l_size.y / float(n_lights.y));
        float l_z = l_pos.z;

        lights[i] = vec4(normalize(vec3(l_x, l_y, l_z)), 1.);
}
	//lights[0] = vec4(normalize(vec3(110.0, 0.0, 300.0)),1.);
	//lights[1] = vec4(normalize(vec3(-110.0, 0.0, 300.0)),1.);
    //lights[2] = vec4(normalize(vec3(0.0, -100.0, 300.0)),1.);
	//lights[3] = vec4(normalize(vec3(0.0, 150.0, 300.0)),1.);
#endif

    vec4 base_opacity = BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_diffuse),var_uv.xy);
    float transmission = 1.;

    vec3 base = g2l(base_opacity.xyz);
    float opacity = base_opacity.w;

    float metallic = 0.;
    float roughness = 0.;
    roughness += GLITTER_ROUGHNESS;

    vec3 N = normalize( mat3(var_t,var_b,var_n)*(BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_normal),var_uv.xy * GLITTER_SCALE).xyz*2.-1.) );

    vec3 V = normalize( -var_v );
    float cN_V = max( 0., dot( N, V ) );
    vec3 R = reflect( -V, N );

    vec3 F0 = mix( vec3(0.04), base, metallic );

    vec3 F = fresnel_schlick_roughness( cN_V, F0, roughness );
    vec3 kD = ( 1. - F )*( 1. - metallic );

    vec3 diffuse = BNB_TEXTURE_CUBE(BNB_SAMPLER_CUBE(tex_ibl_diff), N ).xyz * base;

    vec3 transmission_color = g2l(textureLod(BNB_SAMPLER_2D(camera), var_uv.zw, 0.).xyz);
    //diffuse = mix(diffuse, transmission_color, transmission);


    const float MAX_REFLECTION_LOD = 7.; // number of mip levels in tex_ibl_spec
    vec3 prefilteredColor = BNB_TEXTURE_CUBE_LOD(BNB_SAMPLER_CUBE(tex_ibl_spec), R, roughness*MAX_REFLECTION_LOD ).xyz;
    vec2 brdf = brdf_approx(roughness, cN_V);
    vec3 specular = prefilteredColor * (F * brdf.x + brdf.y);

    //CC IBL
    specular = LIGHT_POWER * 1.0 * pow(specular,vec3(GLITTER_GAMMA)) * LIGHT_COLOR;
    
    vec3 color = (kD*diffuse + specular + transmission_color * transmission);


#ifdef GLFX_LIGHTS
    float ggx2 = geometry_schlick_GGX( cN_V, roughness );
    for( int i = 0; i != l_array /*assume that lights.length() was called.*/; ++i )
    {
        vec4 lw = lights[i];
        vec3 L = lw.xyz;
        float lwrap = lw.w;
        vec3 H = normalize( V + L );
        float N_L = dot( N, L );
        float cN_L = max( 0., N_L );
        float cN_H = max( 0., dot( N, H ) );
        float cH_V = max( 0., dot( H, V ) );

        float NDF = distribution_GGX( cN_H, roughness );
        float G = geometry_smith( cN_L, ggx2, roughness );
        vec3 F_light = fresnel_schlick( cH_V, F0 );

        vec3 specular = NDF*G*F_light/( 4.*cN_V*cN_L + 0.001 );

        //CC LIGHTS
        specular = 1.0 * pow(specular, vec3(GLITTER_GAMMA));

        vec3 kD_light = ( 1. - F_light )*( 1. - metallic );

        color += ( kD_light*base/3.14159265 + specular )*radiance[i]*diffuse_factor( N_L, lwrap );
    }
#endif

    //color = pow(color,vec3(GLITTER_GAMMA));

    float lips_mask = textureLod(BNB_PASS_SAMPLER_ARGUMENT(tex_lips_mask), var_uv.zw, 0.).z;

    bnb_FragColor = vec4(l2g(color),opacity*lips_mask);
}