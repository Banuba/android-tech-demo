#include <bnb/glsl.frag>




BNB_IN(0) vec4 var_uv;


BNB_DECLARE_SAMPLER_2D(4, 5, camera);

BNB_DECLARE_SAMPLER_2D(2, 3, glfx_BACKGROUND);

BNB_DECLARE_SAMPLER_2D(0, 1, glfx_LIPS_MASK);


const float eps = 0.0000001;

vec3 hsv2rgb( in vec3 c )
{
    vec3 rgb = clamp( abs( mod( c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0 ) - 3.0 ) - 1.0, 0.0, 1.0 );
	return c.z * mix( vec3(1.0), rgb, c.y );
}

vec3 rgb2hsv( in vec3 c )
{
    vec4 k = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix( vec4(c.zy, k.wz), vec4(c.yz, k.xy), (c.z < c.y) ? 1.0 : 0.0 );
    vec4 q = mix( vec4(p.xyw, c.x), vec4(c.x, p.yzx), (p.x < c.x) ? 1.0 : 0.0 );
    float d = q.x - min( q.w, q.y );
    return vec3(abs( q.z + (q.w - q.y) / (6.0 * d + eps) ), d / (q.x+eps), q.x );
}

void main()
{
	vec4 maskColor = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_LIPS_MASK), var_uv.zw );
	float maskAlpha = maskColor.x;

	vec3 bg = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), var_uv.xy ).xyz;
	vec3 cam = BNB_TEXTURE_2D(BNB_SAMPLER_2D(camera), var_uv.xy ).xyz;


	bnb_FragColor = vec4(mix(bg, cam, maskAlpha), 1.0);
}
