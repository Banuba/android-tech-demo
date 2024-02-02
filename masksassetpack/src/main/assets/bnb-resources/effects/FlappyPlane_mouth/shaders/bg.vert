#include <bnb/glsl.vert>
#include <bnb/decode_int1010102.glsl>
#define bnb_IDX_OFFSET 0
#ifdef BNB_VK_1
#define gl_VertexID gl_VertexIndex
#define gl_InstanceID gl_InstanceIndex
#endif


// #define GLFX_IBL
// #define GLFX_TBN
// #define GLFX_TEX_MRAO
// #define GLFX_LIGHTING

#define TAP_VIDEO_SCALE 2.0 // Scale the size of the Arm
#define Z_VIDEO_POS -650. // Set the Arm's z-position
#define Y_VIDEO_POS 100. // Set the Arm's y-position

BNB_LAYOUT_LOCATION(0) BNB_IN vec3 attrib_pos;

BNB_OUT(0) vec2 var_uv;

void main()
{

    vec3 vpos = attrib_pos;

    gl_Position = vec4(vpos,1.);

    var_uv = gl_Position.xy * 0.5 + 0.5;

}