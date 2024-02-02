#include <bnb/glsl.frag>
#include <bnb/matrix_operations.glsl>

BNB_IN(0) vec2 var_uv;



BNB_DECLARE_SAMPLER_2D(2, 3, glfx_L_EYE_MASK);

BNB_DECLARE_SAMPLER_2D(4, 5, glfx_L_PUPIL_MASK);

BNB_DECLARE_SAMPLER_2D(6, 7, glfx_L_CORNEOSCLERA_MASK);

BNB_DECLARE_SAMPLER_2D(8, 9, eye_coords);

BNB_DECLARE_SAMPLER_2D(0, 1, eye_tex);

void main()
{
	vec3 coords0 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(eye_coords),vec2(0.,0.)).xyz;
	vec3 coords1 = BNB_TEXTURE_2D(BNB_SAMPLER_2D(eye_coords),vec2(0.,1.)).yxz; // swapped x and y
	
	mat3 et = mat3(coords0,coords1,vec3(0.,0.,1.));
	vec2 tex_uv = (vec3(var_uv,1.) * bnb_inverse_trs2d(et)).xy;
	vec2 bg_tex_uv = vec2(1./3.,1./7.) + tex_uv*vec2(1./3.,2./3.);
	vec4 c = BNB_TEXTURE_2D(BNB_SAMPLER_2D(eye_tex),bg_tex_uv);

	c.xyz *= min(BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_L_EYE_MASK), var_uv ).x 
		+ BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_L_PUPIL_MASK), var_uv ).x
		+ BNB_TEXTURE_2D(BNB_SAMPLER_2D(glfx_L_CORNEOSCLERA_MASK), var_uv ).x,1.)*c.w;

	bnb_FragColor = vec4(c.xyz,1.);
}
