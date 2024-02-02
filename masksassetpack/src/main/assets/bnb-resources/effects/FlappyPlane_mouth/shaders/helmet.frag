#include <bnb/glsl.frag>


BNB_IN(0) vec2 var_uv;
BNB_IN(1) vec2 var_bg_uv;

BNB_DECLARE_SAMPLER_2D(6, 7, face);



vec2 scale_uv(vec2 uv, float scale)
{
	float inv_scale = 1. / scale;
	return vec2(mat3(inv_scale, 0., 0., 0., inv_scale, 0., 0.5, 0.5, 1.0) * vec3(uv - 0.5, 1.));
}

void main()
{
    vec4 face = BNB_TEXTURE_2D(BNB_SAMPLER_2D(face),var_uv);

    bnb_FragColor = face;
    
}