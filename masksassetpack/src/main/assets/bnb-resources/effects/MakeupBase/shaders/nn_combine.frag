#include <bnb/glsl.frag>

BNB_IN(0) vec4 var_brow_uv;
BNB_IN(1) vec4 var_skin_lips_uv;

BNB_DECLARE_SAMPLER_2D(0, 1, tex_lbrow);
BNB_DECLARE_SAMPLER_2D(2, 3, tex_rbrow);
BNB_DECLARE_SAMPLER_2D(4, 5, tex_face);
BNB_DECLARE_SAMPLER_2D(6, 7, tex_skin);
BNB_DECLARE_SAMPLER_2D(8, 9, tex_lips);
BNB_DECLARE_SAMPLER_2D(10, 11, tex_liner);

float box01( vec2 uv )
{
	vec2 xy = step(0.,uv) - step(1.,uv);
	return xy.x * xy.y;
}

void main()
{
	float lbrow = BNB_TEXTURE_2D_LOD( BNB_SAMPLER_2D(tex_lbrow), var_brow_uv.xy, 0. ).x*box01(var_brow_uv.xy);
	float rbrow = BNB_TEXTURE_2D_LOD( BNB_SAMPLER_2D(tex_rbrow), var_brow_uv.zw, 0. ).x*box01(var_brow_uv.zw);
	float brows = lbrow + rbrow;

	float lips_box = box01(var_skin_lips_uv.zw);
	float lips = BNB_TEXTURE_2D_LOD( BNB_SAMPLER_2D(tex_lips), var_skin_lips_uv.zw, 0. ).x*lips_box;
	float lips_liner = BNB_TEXTURE_2D_LOD( BNB_SAMPLER_2D(tex_liner), var_skin_lips_uv.zw, 0. ).x*lips_box;

	float skin;
	if( fake_skin_nn_active.x < 0.5 )
	{
		skin = BNB_TEXTURE_2D_LOD( BNB_SAMPLER_2D(tex_skin), var_skin_lips_uv.xy, 0. ).x*box01(var_skin_lips_uv.xy);
	}
	else
	{
		skin = BNB_TEXTURE_2D_LOD( BNB_SAMPLER_2D(tex_face), var_skin_lips_uv.xy, 0. ).x*box01(var_skin_lips_uv.xy);
		skin = skin*(1.-brows);
		skin = skin*(1.-lips);
	}

	bnb_FragColor = vec4( skin, brows, lips, lips_liner );
}
