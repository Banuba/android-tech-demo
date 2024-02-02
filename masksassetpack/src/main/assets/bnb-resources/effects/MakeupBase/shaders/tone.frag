#include <bnb/glsl.frag>

BNB_IN(0) vec2 var_uv;
flat BNB_IN(1) vec3 I_stddev;
flat BNB_IN(2) vec4 var_param_abcd;
flat BNB_IN(3) vec4 var_param_krpw;
flat BNB_IN(4) vec4 var_param_rgb;

BNB_DECLARE_SAMPLER_2D(0, 1, tex_input);
BNB_DECLARE_SAMPLER_2D(2, 3, tex_blur_hsv);
BNB_DECLARE_SAMPLER_2D(4, 5, tex_mean);
BNB_DECLARE_SAMPLER_2D(8, 9, tex_mask);

vec3 rgb2hsv(in vec3 c)
{
	const float eps = 0.0001;
	vec4 k = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
	vec4 p = mix(vec4(c.zy, k.wz), vec4(c.yz, k.xy), (c.z < c.y) ? 1.0 : 0.0);
	vec4 q = mix(vec4(p.xyw, c.x), vec4(c.x, p.yzx), (p.x < c.x) ? 1.0 : 0.0);
	float d = q.x - min(q.w, q.y);

	// (180./255.) scale is to mimic OpenCV cv::COLOR_RGB2HSV conversion which outputs H in [0., 180./255.] range
	return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + eps))*(180./255.), d / (q.x + eps), q.x);
}

vec3 hsv2rgb(in vec3 c)
{
	c.x *= 255./180.;
	vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
	return c.z * mix(vec3(1.0), rgb, c.y);
}

float box01( vec2 uv )
{
	vec2 xy = step(0.,uv) - step(1.,uv);
	return xy.x * xy.y;
}

void main()
{
	if (var_param_krpw.w < 0.5) {
		bnb_FragColor = vec4(BNB_TEXTURE_2D_LOD( BNB_SAMPLER_2D(tex_input), var_uv, 0. ).xyz, 1.);
		return;
	}

	vec3 I = BNB_TEXTURE_2D_LOD( BNB_SAMPLER_2D(tex_input), var_uv, 0. ).xyz;
	vec3 I_ = BNB_TEXTURE_2D_LOD( BNB_SAMPLER_2D(tex_blur_hsv), var_uv, 0. ).xyz;
	vec4 I_mean_ = BNB_TEXTURE_2D_LOD( BNB_SAMPLER_2D(tex_mean), vec2(0.5), 0. );
	vec3 I_mean = I_mean_.xyz/max(I_mean_.w,0.00001);

	vec4 makeup;
	makeup.rgb = var_param_rgb.rgb;
	makeup.a = BNB_TEXTURE_2D_LOD( BNB_SAMPLER_2D(tex_mask), var_uv, 0. )[int(var_param_rgb.w)];

	vec3 TColor = rgb2hsv(makeup.bgr); // .bgr is needed to match OpenCV python version of algorithm

	float a = var_param_abcd.x;
	float b = var_param_abcd.y;
	float c = var_param_abcd.z;
	float d = var_param_abcd.w;
	float k = var_param_krpw.x;

	float x = TColor[0];
	float y = TColor[1];
	float z = TColor[2];
	if( TColor[2] > I_mean[2] )
		z *= I_mean[2]/TColor[2];

	y += (I_[1] - I_mean[1]) * (a * I_stddev[1] + b) / I_stddev[1];
	z += (I_[2] - I_mean[2]) * (c * I_stddev[2] + d) / I_stddev[2];

	I_ = clamp( vec3( x, y, z ), 0., 1. );

	float M = makeup.w*k;
	bnb_FragColor = vec4( 
		mix( 
			I, 
			hsv2rgb( I_ ).bgr, // .bgr is needed to match OpenCV python version of algorithm
			M ), 
		1. );
}
