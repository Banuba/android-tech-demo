#include <bnb/glsl.frag>

BNB_IN(0) vec2 var_uv;
flat BNB_IN(1) vec4 var_param;

BNB_DECLARE_SAMPLER_2D(0, 1, tex_input);
BNB_DECLARE_SAMPLER_2D(2, 3, tex_mask);

float gauss( float x, float y, float sigma_mult )
{
	return exp( -sigma_mult*(x*x + y*y) );
}

vec3 putBlur( BNB_DECLARE_SAMPLER_2D_ARGUMENT(img), vec2 uv, float r, float p )
{
#ifdef BNB_GL_ES_1
	vec3 c = BNB_TEXTURE_2D( BNB_SAMPLER_2D(img), uv ).rgb;
#else
	ivec2 isz = textureSize(BNB_SAMPLER_2D(img),0);
	ivec2 isz1 = isz - 1;
	ivec2 iuv = ivec2(uv*vec2(isz));
	vec3 c = texelFetch( BNB_SAMPLER_2D(img), iuv, 0 ).rgb;
#endif
	float sigma = (r*2.-1.)/4.;
	float sigma_mult = 1./(2.*sigma*sigma);

	vec3 blurred = c;
	float mult_sum = 1.;
#ifdef BNB_GL_ES_1
	for( float y = 0.; y <= r; y += 1. )
	{
		for( float x = 1.; x <= r; x += 1. )
		{
			float mult = gauss(x,y,sigma_mult);
			mult_sum += mult*4.;
			blurred += mult*(
				BNB_TEXTURE_2D( BNB_SAMPLER_2D(tex_input), var_uv + vec2( x, y)*bnb_SCREEN.zw ).rgb + 
				BNB_TEXTURE_2D( BNB_SAMPLER_2D(tex_input), var_uv + vec2(-y, x)*bnb_SCREEN.zw ).rgb +
				BNB_TEXTURE_2D( BNB_SAMPLER_2D(tex_input), var_uv + vec2(-x,-y)*bnb_SCREEN.zw ).rgb +
				BNB_TEXTURE_2D( BNB_SAMPLER_2D(tex_input), var_uv + vec2( y,-x)*bnb_SCREEN.zw ).rgb);
		}
	}
#else
	int ir = int(r);
	for( int y = 0; y <= ir; ++y )
	{
		for( int x = 1; x <= ir; ++x )
		{
			float mult = gauss(float(x),float(y),sigma_mult);
			mult_sum += mult*4.;
			blurred += mult*(
				texelFetch( BNB_SAMPLER_2D(tex_input), clamp( iuv + ivec2( x, y), ivec2(0), isz1 ), 0 ).rgb + 
				texelFetch( BNB_SAMPLER_2D(tex_input), clamp( iuv + ivec2(-y, x), ivec2(0), isz1 ), 0 ).rgb +
				texelFetch( BNB_SAMPLER_2D(tex_input), clamp( iuv + ivec2(-x,-y), ivec2(0), isz1 ), 0 ).rgb +
				texelFetch( BNB_SAMPLER_2D(tex_input), clamp( iuv + ivec2( y,-x), ivec2(0), isz1 ), 0 ).rgb);
		}
	}
#endif
	blurred *= 1./mult_sum;
	blurred = clamp( blurred, 0., 1. );
	return mix( c, blurred, p );
}

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

void main()
{
	float r = var_param.x;
	float p = var_param.y;
	vec3 I_ = putBlur( BNB_PASS_SAMPLER_ARGUMENT(tex_input), var_uv, r, p );
	I_ = rgb2hsv( I_.bgr ); // .bgr is needed to match OpenCV python version of algorithm

	float max_a = var_param.z;
	float M = step( 0.5*max_a, BNB_TEXTURE_2D_LOD( BNB_SAMPLER_2D(tex_mask), var_uv, 0. )[int(var_param.w)] );
	bnb_FragColor = vec4( I_, M );
}
