#include <bnb/glsl.frag>


BNB_IN(0) vec2 var_uv;



BNB_DECLARE_SAMPLER_VIDEO(0, 1, glfx_VIDEO);

void main()
{
	
	vec2 uv = var_uv;
	vec3 rgb = 0.8 * BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_VIDEO),uv).xyz;
	float alpha = 1.0 * BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_VIDEO),uv).z;
	//vec3 rgb = 0.5 * BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_diffuse),uv).xyz;
	//float alpha = 0.8 * BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_diffuse),uv).z;

	bnb_FragColor = vec4(rgb,alpha);
	//bnb_FragColor = 0.2 * BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_diffuse),uv);

}

