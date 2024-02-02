#include <bnb/glsl.frag>


BNB_IN(0) vec2 var_uv;



BNB_DECLARE_SAMPLER_2D(0, 1, glfx_BACKGROUND);


void main()
{
	vec3 color = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), var_uv ).xyz;

	color = 0.8 * pow(color,vec3(2.3));
	
    if (length(color) > 0.7 && length(color) < 1.0) {
		bnb_FragColor = vec4(pow(length(color), 1.3));
	} else {
		bnb_FragColor = vec4(0.);
	}
}
