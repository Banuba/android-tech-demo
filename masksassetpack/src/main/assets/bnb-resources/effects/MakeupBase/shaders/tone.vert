#include <bnb/glsl.vert>

BNB_LAYOUT_LOCATION(0) BNB_IN vec3 attrib_pos;

BNB_OUT(0) vec2 var_uv;
flat BNB_OUT(1) vec3 I_stddev;
flat BNB_OUT(2) vec4 var_param_abcd;
flat BNB_OUT(3) vec4 var_param_krpw;
flat BNB_OUT(4) vec4 var_param_rgb;

BNB_DECLARE_SAMPLER_2D(6, 7, tex_stddev);

void main()
{
	vec2 v = attrib_pos.xy;
	gl_Position = vec4( v, 0., 1. );
	var_uv = v*0.5 + 0.5;

#ifdef BNB_VK_1
	var_uv.y = 1. - var_uv.y;
#endif

	vec4 I_stddev_ = BNB_TEXTURE_2D_LOD( BNB_SAMPLER_2D(tex_stddev), vec2(0.5), 0. );
	I_stddev = sqrt( I_stddev_.xyz/max(I_stddev_.w,0.00001) );

	int f = int(attrib_pos.z);
	if( f == 0 )
	{
		var_param_abcd = foundation_abcd;
		var_param_krpw = foundation_krp;
		var_param_rgb = vec4(foundation_rgb_maxa.rgb,0.);
	}
	else if( f == 1 )
	{
		var_param_abcd = concealer_abcd;
		var_param_krpw = concealer_krp;
		var_param_rgb = vec4(concealer_rgb_maxa.rgb,0.);
	}
	else if( f == 2 )
	{
		var_param_abcd = contour_abcd;
		var_param_krpw = contour_krp;
		var_param_rgb = vec4(contour_rgb_maxa.rgb,1.);
	}
	else if( f == 3 )
	{
		var_param_abcd = highlighter_abcd;
		var_param_krpw = highlighter_krp;
		var_param_rgb = vec4(highlighter_rgb_maxa.rgb,2.);
	}
	else if( f == 4 )
	{
		var_param_abcd = blush_abcd;
		var_param_krpw = blush_krp;
		var_param_rgb = vec4(blush_rgb_maxa.rgb,3.);
	}
	else if( f == 5 )
	{
		var_param_abcd = lipstick_abcd;
		var_param_krpw = lipstick_krp;
		var_param_rgb = vec4(lipstick_rgb_maxa.rgb,2.);
	}
	else if( f == 6 )
	{
		var_param_abcd = lipsliner_abcd;
		var_param_krpw = lipsliner_krp;
		var_param_rgb = vec4(lipsliner_rgb_maxa.rgb,3.);
	}
	else if( f == 7 )
	{
		var_param_abcd = eyeshadow0_abcd;
		var_param_krpw = eyeshadow0_krp;
		var_param_rgb = vec4(eyeshadow0_rgb_maxa.rgb,0.);
	}
	else if( f == 8 )
	{
		var_param_abcd = eyeshadow1_abcd;
		var_param_krpw = eyeshadow1_krp;
		var_param_rgb = vec4(eyeshadow1_rgb_maxa.rgb,1.);
	}
	else if( f == 9 )
	{
		var_param_abcd = eyeshadow2_abcd;
		var_param_krpw = eyeshadow2_krp;
		var_param_rgb = vec4(eyeshadow2_rgb_maxa.rgb,2.);
	}
	else if( f == 10 )
	{
		var_param_abcd = eyeliner_abcd;
		var_param_krpw = eyeliner_krp;
		var_param_rgb = vec4(eyeliner_rgb_maxa.rgb,3.);
	}
	else //if( f == 11 )
	{
		var_param_abcd = eyebrows_abcd;
		var_param_krpw = eyebrows_krp;
		var_param_rgb = vec4(eyebrows_rgb_maxa.rgb,1.);
	}
}
