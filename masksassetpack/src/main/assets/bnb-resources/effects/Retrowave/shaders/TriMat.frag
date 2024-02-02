#include <bnb/glsl.frag>


BNB_IN(0) vec2 var_uv;
BNB_IN(1) vec4 random;



BNB_DECLARE_SAMPLER_2D(0, 1, glfx_BACKGROUND);

float time;

float rand () {
    return fract(sin(time)*10000.0);
}

void main()
{	
	time = random.x;

	vec2 uvR = var_uv;
	vec2 uvG = var_uv;
	vec2 uvB = var_uv;

	uvR.x = var_uv.x * 1.0 - rand() * 0.02 * 0.8;
	uvB.y = var_uv.y * 1.0 + rand() * 0.02 * 0.8;

	if (uvG.y < rand() && uvG.y > rand() -0.1 && sin(time) < 0.0)
	{
		uvG.x = (uvG + 0.02 * rand()).x;
	}

	vec4 c;
	c.r = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), uvR).r;
	c.g = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), uvG).g;
	c.b = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), uvB).b;
	c.w = 1.0;

	float scanline = sin (var_uv.y * 800.0 * rand())/30.0;
	c *= 1.0 - scanline;

	float vegDist = length((0.5, 0.5) - var_uv);
	c *= 1.0 - vegDist * 0.6;

	bnb_FragColor = c;
}
