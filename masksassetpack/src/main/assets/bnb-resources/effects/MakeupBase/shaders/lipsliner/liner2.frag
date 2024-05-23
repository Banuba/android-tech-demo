#include <bnb/glsl.frag>

BNB_DECLARE_SAMPLER_2D(0, 1, liner1);

BNB_IN(0) float var_scale;

float expand( BNB_DECLARE_SAMPLER_2D_ARGUMENT(img), ivec2 iuv, float r )
{
	ivec2 isz1 = textureSize(BNB_SAMPLER_2D(img),0) - 1;
	float c = texelFetch( BNB_SAMPLER_2D(img), iuv, 0 ).x;

	float expanded = c;

	int ir = int(r)+1;
	for( int y = 0; y <= ir; ++y )
	{
		for( int x = 1; x <= ir; ++x )
		{
			expanded = max(expanded, texelFetch( BNB_SAMPLER_2D(img), clamp( iuv + ivec2( x, y), ivec2(0), isz1 ), 0 ).x);
			expanded = max(expanded, texelFetch( BNB_SAMPLER_2D(img), clamp( iuv + ivec2(-y, x), ivec2(0), isz1 ), 0 ).x);
			expanded = max(expanded, texelFetch( BNB_SAMPLER_2D(img), clamp( iuv + ivec2(-x,-y), ivec2(0), isz1 ), 0 ).x);
			expanded = max(expanded, texelFetch( BNB_SAMPLER_2D(img), clamp( iuv + ivec2( y,-x), ivec2(0), isz1 ), 0 ).x);
		}
	}
	return expanded;
}

void main()
{
	float m = expand( BNB_PASS_SAMPLER_ARGUMENT(liner1), ivec2(gl_FragCoord.xy), smooth_weights_r1_r2.z*var_scale );
	bnb_FragColor = vec4(m,0.,0.,0.);
}
