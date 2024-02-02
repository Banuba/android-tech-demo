#include <bnb/glsl.frag>


BNB_IN(0) vec2 var_uv;



BNB_DECLARE_SAMPLER_2D(0, 1, glfx_BACKGROUND);


void main()
{
	vec3 color = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), var_uv ).xyz;
	bnb_FragColor = vec4 (color, 1.0);
    bnb_FragColor.rgb *= 0.99;
}
