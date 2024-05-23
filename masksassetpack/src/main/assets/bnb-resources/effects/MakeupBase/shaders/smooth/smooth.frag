#include <bnb/glsl.frag>

BNB_IN(0) vec2 var_uv;

BNB_DECLARE_SAMPLER_2D(0, 1, tex);
BNB_DECLARE_SAMPLER_2D(2, 3, mask_tex0);
BNB_DECLARE_SAMPLER_2D(4, 5, mask_tex1);

vec4 soften(BNB_DECLARE_SAMPLER_2D_ARGUMENT(tex_camera), vec2 uv, float factor)
{
    vec4 camera = BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_camera), uv);
    vec3 originalColor = camera.xyz;
    vec3 screenColor = originalColor;

    float dx = 4.5 / bnb_SCREEN.x;
    float dy = 4.5 / bnb_SCREEN.y;

    vec3 nextColor0 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_camera), vec2(uv.x - dx, uv.y - dy)).xyz;
    vec3 nextColor1 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_camera), vec2(uv.x + dx, uv.y - dy)).xyz;
    vec3 nextColor2 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_camera), vec2(uv.x - dx, uv.y + dy)).xyz;
    vec3 nextColor3 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_camera), vec2(uv.x + dx, uv.y + dy)).xyz;

    float intensity = screenColor.g;
    vec4 nextIntensity = vec4(nextColor0.g, nextColor1.g, nextColor2.g, nextColor3.g);
    vec4 lg = nextIntensity - intensity;

    const float PSI = 0.05;
    vec4 curr = max(0.367 - abs(lg * (0.367 * 0.6 / (1.41 * PSI))), 0.);

    float summ = 1.0 + curr.x + curr.y + curr.z + curr.w;
    screenColor += (nextColor0 * curr.x + nextColor1 * curr.y + nextColor2 * curr.z + nextColor3 * curr.w);
    screenColor = screenColor * (factor / summ);

    screenColor = originalColor * (1. - factor) + screenColor;
    return vec4(screenColor, camera.a);
}

void main()
{
	float mask0 = textureLod( BNB_SAMPLER_2D(mask_tex0), var_uv, 0. ).x;
	float mask1 = textureLod( BNB_SAMPLER_2D(mask_tex1), var_uv, 0. ).x;

	float mask = min( mask0*smooth_weights_r1_r2[0] + mask1*smooth_weights_r1_r2[1], 1. );

	bnb_FragColor = soften( BNB_PASS_SAMPLER_ARGUMENT(tex), var_uv, mask );
}
