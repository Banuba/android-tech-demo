#include <bnb/glsl.frag>

BNB_IN(0)
vec2 var_uv;

BNB_DECLARE_SAMPLER_2D(0, 1, tex_mask);

void main()
{
    if (eyelashes_krp.w < 0.5) {
		bnb_FragColor = vec4(0.);
        return;
	}

    vec4 lashes = BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_mask), var_uv);

    bnb_FragColor = vec4(lashes.rgb + eyelashes_rgb_maxa.rgb, lashes.a * eyelashes_rgb_maxa.a * eyelashes_krp.x);
}
