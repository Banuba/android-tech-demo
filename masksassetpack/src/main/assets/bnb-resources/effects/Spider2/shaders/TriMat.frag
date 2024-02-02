#include <bnb/glsl.frag>


BNB_IN(0) vec2 var_uv;



BNB_DECLARE_SAMPLER_VIDEO(0, 1, glfx_VIDEO);

vec2 aspect_fill_uv_tex(vec2 uv)
{
    vec2 textureSize = vec2(720.,640.);
    float aspect_ratio = bnb_SCREEN.y / bnb_SCREEN.x;
    float texture_aspect_ratio = textureSize.y / textureSize.x;
    float scale_x = 1.0;
    float scale_y = 1.0;
    if (texture_aspect_ratio > aspect_ratio) {
        scale_y = texture_aspect_ratio / aspect_ratio;
    } else {
        scale_x = aspect_ratio / texture_aspect_ratio;
    }
    
    float inv_scale_x = 1. / scale_x;
    float inv_scale_y = 1. / scale_y;
    
    return vec2(mat3(inv_scale_x, 0., 0., 0., inv_scale_y, 0., 0.5, 0.5, 1.0) * vec3(uv - 0.5, 1.));
}

void main()
{
	vec2 uv = var_uv;
	uv = aspect_fill_uv_tex(uv);
	uv.x *= 0.5;
	vec3 rgb = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_VIDEO),uv).xyz;
	uv.x += 0.5;
	float a = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_VIDEO),uv).x;
	bnb_FragColor = vec4(rgb,a);
}

