#include <bnb/glsl.frag>


BNB_IN(0) vec2 var_uv;
BNB_IN(1) float var_time;



BNB_DECLARE_SAMPLER_2D(0, 1, glfx_BACKGROUND);

float hash11(float p)
{
	p = fract(p * 0.1031);
	p *= p + 33.33;
	p *= p + p;
	return fract(p);
}

float random(vec2 st)
{
	return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 hash22(vec2 p)
{
	vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
	p3 += dot(p3, p3.yzx + 33.33);
	return fract((p3.xx + p3.yz) * p3.zy);

}

vec3 shift_color(vec2 uv, float off)
{
	vec3 clr1 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), fract(uv - vec2(0.0, off))).rgb;
	vec3 clr2 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), fract(uv + vec2(off, off + off))).rgb;
	vec3 clr3 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), fract(uv - vec2(off, 0.0))).rgb;

	vec3 c1 = clr1 * vec3(1.000, 0.000, 0.000);
	vec3 c2 = clr2 * vec3(0.416, 0.353, 0.803);
	vec3 c3 = clr3 * vec3(0.500, 1.000, 0.831);
	
	vec3 color = vec3(0.0);
	color = max(color, c1);
	color = max(color, c2);
	color = max(color, c3);
	
	return color;
}

vec3 aberration(vec2 uv, vec2 off)
{
	float r = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), uv).r;
	float g = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), clamp(uv - off, 0.0, 1.0)).g;
	float b = BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_BACKGROUND), clamp(uv - off - off, 0.0, 1.0)).b;
	
	return vec3(r, g, b);
}

vec2 glitch_color(vec2 uv, float lines, float r) {
	float y = floor(uv.y * lines) / lines;
	float off_right = random(vec2(r, y));
	float off_left = random(vec2(off_right, y));
	
	float rand = random(vec2(off_right, off_left));
	
	float condition = step(off_left, uv.x) * step(off_right, 1.0 - uv.x) * step(0.95, rand);
	uv.x = mix(uv.x * 0.98, uv.x, condition);
	return uv;
}

float stripes(float t, float w, float e)
{
	return smoothstep((1.0 - e) / 4.0, (1.0 + e) / 4.0, w * abs(fract(t) - 0.5));
}

float spike(float t, float c, float w, float s)
{
	return smoothstep(0.0, 1.0, s * w - abs(t - c) * s);
}

float vertical_areas(float t)
{
	return
		3.0 * spike(t, 0.05, 0.095, 40.0)+
		0.5 * spike(t, 0.15, 0.035, 40.0)+
		0.2 * spike(t, 0.20, 0.032, 40.0)+
		0.7 * spike(t, 0.30, 0.025, 40.0)+
		0.7 * spike(t, 0.35, 0.037, 40.0)+
		0.5 * spike(t, 0.42, 0.050, 40.0)+
		3.0 * spike(t, 0.50, 0.050, 40.0)+
		0.1 * spike(t, 0.59, 0.055, 40.0)+
		0.2 * spike(t, 0.79, 0.090, 10.0)+
		3.0 * spike(t, 0.95, 0.100, 40.0);
}

float white_glitch(float t)
{
	t *= 1.5;
	return 0.3333 * step(1.9, mod(t - 1.4, 3.9)) * step(1.1, mod(t, 1.9)) * (
		step(0.9, mod(t,1.1)) +
		step(0.8, mod(t,3.1)) +
		step(0.7, mod(t,1.3)));
}

void main()
{
	vec2 uv = var_uv;

	float lines = (stripes(uv.y*200.-uv.x*13.,0.5,0.9)+0.3)*vertical_areas(uv.x);
	float linesM = white_glitch(var_time)*(0.5 + uv.y*uv.y*0.5);
	lines = min(1.,lines*linesM);
	uv.x += lines*0.1;
	uv.y -= lines*0.05;

	float r = random(vec2(floor(var_time * 7.0) / 7.0));
	uv = glitch_color(uv, 30.0, floor(var_time * 5.0) / 5.0 + r);
	vec3 color = aberration(uv, vec2(0.001, 0.005));
	
	vec4 lb_rt_corners;
	float rr = random(vec2(floor(var_time * 3.0), floor(var_time * 3.0)));
	lb_rt_corners.x = hash11(rr);
	lb_rt_corners.y = hash11(lb_rt_corners.x);
	lb_rt_corners.z = hash11(lb_rt_corners.y);
	lb_rt_corners.w = hash11(lb_rt_corners.z);
	
	float condition = step(min(lb_rt_corners.x, lb_rt_corners.z), uv.x);
	condition *= step(max(lb_rt_corners.x, lb_rt_corners.z), 1.0 - uv.x);
	condition *= step(min(lb_rt_corners.y, lb_rt_corners.w), uv.y);
	condition *= step(max(lb_rt_corners.y, lb_rt_corners.w), 1.0 - uv.y);
	condition *= step(0.4, rr);
	
	color = max(color, shift_color(uv, 0.04) * condition);

	color += lines;

	bnb_FragColor = vec4(color, 1.0);
}