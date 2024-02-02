#include <bnb/glsl.frag>
#include <bnb/color_spaces.glsl>

BNB_IN(0)
vec2 var_uv;
BNB_IN(1)
vec2 var_l_eye_mask_uv;
BNB_IN(2)
vec2 var_r_eye_mask_uv;

BNB_DECLARE_SAMPLER_2D(0, 1, tex_camera);
BNB_DECLARE_SAMPLER_2D(2, 3, tex_l_eye_mask);
BNB_DECLARE_SAMPLER_2D(4, 5, tex_r_eye_mask);



vec4 color(vec4 base, vec4 blend)
{

    
    vec3 colored  = vec3(base.r<0.5?(2.0*base.r*blend.r):(1.0-2.0*(1.0-base.r)*(1.0-blend.r)),
                         base.g<0.5?(2.0*base.g*blend.g):(1.0-2.0*(1.0-base.g)*(1.0-blend.g)),
                         base.b<0.5?(2.0*base.b*blend.b):(1.0-2.0*(1.0-base.b)*(1.0-blend.b)));
    return vec4(colored, base.a); // Overlay
    
}

void main()
{
    vec4 l_eye = BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_l_eye_mask), var_l_eye_mask_uv);
    vec4 r_eye = BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_r_eye_mask), var_r_eye_mask_uv);
    float mask = l_eye.x + r_eye.x;

    vec4 camera = BNB_TEXTURE_2D(BNB_SAMPLER_2D(tex_camera), var_uv);

    vec4 overlay_color = vec4(mix(var_eyes_color.rgb, vec3(0.5), 1.0 - var_eyes_color.a),var_eyes_color.a); //mix with gray is opacity for overlay
    vec4 colored = color(camera, overlay_color);

    bnb_FragColor = vec4(colored.rgb, 1.0 * mask);
}
