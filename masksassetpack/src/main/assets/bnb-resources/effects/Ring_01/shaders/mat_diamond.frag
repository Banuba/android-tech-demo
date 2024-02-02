#include <bnb/glsl.frag>

#define RAY_LENGTH_MAX		20.0
#define RAY_BOUNCE_MAX		3
#define RAY_STEP_MAX		5
#define COLOR				vec3 (1.3, 1.3, 1.5)
#define ALPHA				1.3
#define REFRACT_INDEX		vec3 (2.443, 2.415, 2.463)
#define LIGHT				vec3 (0.0, 0.0, -1.0)
#define AMBIENT				0.15
#define SPECULAR_POWER		1.8
#define SPECULAR_INTENSITY	0.7

// Math constants
#define DELTA	0.001

BNB_IN(0) vec2 var_uv;
BNB_IN(1) vec3 var_n;
BNB_IN(2) vec3 var_v;
BNB_IN(3) vec3 var_cam_pos;

BNB_DECLARE_SAMPLER_2D(0, 1, tex_diffuse);
BNB_DECLARE_SAMPLER_2D(2, 3, tex_metallic);
BNB_DECLARE_SAMPLER_2D(4, 5, tex_roughness);
BNB_DECLARE_SAMPLER_CUBE(6, 7, tex_ibl_diff);
BNB_DECLARE_SAMPLER_CUBE(8, 9, tex_ibl_spec);
BNB_DECLARE_SAMPLER_CUBE(10, 11, tex_skybox);
BNB_DECLARE_SAMPLER_2D(12, 13, tex_brdf);

// gamma to linear
vec3 g2l(vec3 g)
{
    return g * (g * (g * 0.305306011 + 0.682171111) + 0.012522878);
}

// combined hdr to ldr and linear to gamma
vec3 l2g(vec3 l)
{
    return sqrt(1.33 * (1. - exp(-l))) - 0.03;
}

vec3 fresnel_schlick_roughness(float prod, vec3 F0, float roughness)
{
    return F0 + (max(F0, 1. - roughness) - F0) * pow(1. - prod, 5.);
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

vec3 lightDirection = normalize (LIGHT);
float raycast (in vec3 origin, in vec3 direction, in vec4 normal, in float color, in vec3 channel) {

	// The ray continues...
	color *= 1.0 - ALPHA;
	float intensity = ALPHA;
	float distanceFactor = 1.0;
	float refractIndex = dot (REFRACT_INDEX, channel);
	for (int rayBounce = 1; rayBounce < RAY_BOUNCE_MAX; ++rayBounce) {

		// Interface with the material
		vec3 refraction = refract (direction, normal.xyz, distanceFactor > 0.0 ? 1.0 / refractIndex : refractIndex);
		if (dot (refraction, refraction) < DELTA) {
			direction = reflect (direction, normal.xyz);
			origin += direction * DELTA * 2.0;
		} else {
			direction = refraction;
			distanceFactor = -distanceFactor;
		}

		// Ray marching
		float dist = RAY_LENGTH_MAX;
		for (int rayStep = 0; rayStep < RAY_STEP_MAX; ++rayStep) {
			dist = distanceFactor * distance(origin, var_v);
			float distMin = max (dist, DELTA);
			normal.w += distMin;
			if (dist < 0.0 || normal.w > RAY_LENGTH_MAX) {
				break;
			}
			origin += direction * distMin;
		}

		// Check whether we hit something
		if (dist >= 0.0) {
			break;
		}

		// Get the normal
		normal.xyz = distanceFactor * var_n;

		// Basic lighting
		if (distanceFactor > 0.0) {
			float relfectionDiffuse = max (0.0, dot (normal.xyz, lightDirection));
			float relfectionSpecular = pow (max (0.0, dot (reflect (direction, normal.xyz), lightDirection)), SPECULAR_POWER) * SPECULAR_INTENSITY;
			float localColor = (AMBIENT + relfectionDiffuse) * dot (COLOR, channel) + relfectionSpecular;
			color += localColor * (1.0 - ALPHA) * intensity;
			intensity *= ALPHA;
		}
	}

	// Get the background color
	float backColor = dot (BNB_TEXTURE_CUBE(BNB_SAMPLER_CUBE(tex_skybox), direction).rgb, channel);
	// float backColor = dot (BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), var_bg_uv).rgb, channel);
	// Return the intensity of this color channel
	return color + backColor * intensity;
}

void main()
{
	vec4 base_opacity = texture(BNB_SAMPLER_2D(tex_diffuse), var_uv);

    vec3 base = g2l(base_opacity.xyz);
    float opacity = base_opacity.w;

    float metallic = BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_metallic),var_uv).x;
    float roughness = BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_roughness),var_uv).x;

    vec3 N = normalize(var_n);

    vec3 V = normalize(-var_v);
    float cN_V = max(0., dot(N, V));
    vec3 R = reflect(-V, N);

    vec3 F0 = mix(vec3(0.04), base, metallic);

    vec3 F = fresnel_schlick_roughness(cN_V, F0, roughness);
    vec3 kD = (1. - F) * (1. - metallic);

    vec3 diffuse = texture(BNB_SAMPLER_CUBE(tex_ibl_diff), N).xyz * base;

    const float MAX_REFLECTION_LOD = 7.; // number of mip levels in tex_ibl_spec
    vec3 prefilteredColor = textureLod(BNB_SAMPLER_CUBE(tex_ibl_spec), R, roughness * MAX_REFLECTION_LOD).xyz;
    vec2 brdf = brdf_approx(roughness, cN_V);
    vec3 specular = prefilteredColor * (F0 * brdf.x + brdf.y);

	//cc////////////////
	diffuse = 1.0 * pow(diffuse,vec3(1.0)) + vec3(0.0);
	specular = 0.6 * pow(specular,vec3(2.5)) + vec3(0.0);
	kD = 1.0 * pow(kD,vec3(1.0)) + vec3(0.0);
	///////////////////
    vec3 color = (kD * diffuse + specular);

    vec4 final_color = vec4(l2g(color),opacity);




	vec3 origin = var_cam_pos;
	vec3 forward = normalize(-origin);
	vec4 normal = vec4(var_n, 0.0);
	float dist = RAY_LENGTH_MAX;


	normal = normalize(normal);
	
	float relfectionDiffuse = max (0.0, dot (normal.xyz, lightDirection));
	float relfectionSpecular = pow (max (0.0, dot (reflect (forward, normal.xyz), lightDirection)), SPECULAR_POWER) * SPECULAR_INTENSITY;
	
	vec4 reflection_color;
	reflection_color.rgb = (AMBIENT + relfectionDiffuse) * COLOR + relfectionSpecular;
	
	reflection_color.r = raycast (origin, forward, normal, reflection_color.r, vec3 (1.0, 0.0, 0.0));
	reflection_color.g = raycast (origin, forward, normal, reflection_color.g, vec3 (0.0, 1.0, 0.0));
	reflection_color.b = raycast (origin, forward, normal, reflection_color.b, vec3 (0.0, 0.0, 1.0));
	reflection_color.a = 1.0;

    //CC///////////////
    reflection_color.rgb = 0.4 * pow(reflection_color.rgb, vec3(1.0));
    final_color.rgb = 1.0 * pow(final_color.rgb, vec3(1.0));
	final_color.a = 0.7 * pow(final_color.a, 1.0);
	//////////////////
	bnb_FragColor = vec4(min(final_color.rgb + reflection_color.rgb, 1.), final_color.a);

    
    float f = 0.0; // desaturate
    float L = 0.3*bnb_FragColor.r + 0.6*bnb_FragColor.g + 0.1*bnb_FragColor.b;
    bnb_FragColor.r = bnb_FragColor.r + f * (L - bnb_FragColor.r);
    bnb_FragColor.g = bnb_FragColor.g + f * (L - bnb_FragColor.g);
    bnb_FragColor.b = bnb_FragColor.b + f * (L - bnb_FragColor.b);   


}
