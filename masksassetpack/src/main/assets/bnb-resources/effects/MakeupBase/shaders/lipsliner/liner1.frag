#include <bnb/glsl.frag>

BNB_DECLARE_SAMPLER_2D(0, 1, liner0);

float bin_sample( ivec2 iuv )
{
	return step( 0.5, texelFetch( BNB_SAMPLER_2D(liner0), iuv, 0 ).x );
}

void main()
{
	ivec2 iuv = ivec2(gl_FragCoord.xy);
	ivec2 isz1 = textureSize( BNB_SAMPLER_2D(liner0), 0 ) - 1;

	float cmm = bin_sample(clamp(iuv+ivec2(-1,-1),ivec2(0),isz1));
	float c0m = bin_sample(clamp(iuv+ivec2( 0,-1),ivec2(0),isz1));
	float cpm = bin_sample(clamp(iuv+ivec2( 1,-1),ivec2(0),isz1));

	float cm0 = bin_sample(clamp(iuv+ivec2(-1, 0),ivec2(0),isz1));
	float c00 = bin_sample(iuv);
	float cp0 = bin_sample(clamp(iuv+ivec2( 1, 0),ivec2(0),isz1));

	float cmp = bin_sample(clamp(iuv+ivec2(-1, 1),ivec2(0),isz1));
	float c0p = bin_sample(clamp(iuv+ivec2( 0, 1),ivec2(0),isz1));
	float cpp = bin_sample(clamp(iuv+ivec2( 1, 1),ivec2(0),isz1));
	
	bnb_FragColor = vec4(c00*8.-(cmm+c0m+cpm+cm0+cp0+cmp+c0p+cpp),0.,0.,0.);
}
