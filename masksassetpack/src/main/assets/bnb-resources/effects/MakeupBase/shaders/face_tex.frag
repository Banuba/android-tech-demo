#include <bnb/glsl.frag>

BNB_IN(0) vec4 var_uv;
BNB_IN(1) vec2 var_face_uv;

BNB_DECLARE_SAMPLER_2D(0, 1, tex0);
BNB_DECLARE_SAMPLER_2D(2, 3, tex1);
BNB_DECLARE_SAMPLER_2D(4, 5, mask);
BNB_DECLARE_SAMPLER_2D(6, 7, face);

layout(location = 1) out vec4 bnb_FragColor2;

void main()
{
	float m = BNB_TEXTURE_2D_LOD( BNB_SAMPLER_2D(mask), var_uv.zw, 0. ).x;
	m *= sqrt(BNB_TEXTURE_2D_LOD( BNB_SAMPLER_2D(face), var_face_uv, 0.).x); // sqrt to make face mask to not darken edges too much
	bnb_FragColor = BNB_TEXTURE_2D( BNB_SAMPLER_2D(tex0), var_uv.xy ) * m;
	bnb_FragColor2 = BNB_TEXTURE_2D( BNB_SAMPLER_2D(tex1), var_uv.xy ) * m;
}
