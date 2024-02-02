#include <bnb/glsl.vert>
#include <bnb/decode_int1010102.glsl>
#include<bnb/matrix_operations.glsl>
#define bnb_IDX_OFFSET 0
#ifdef BNB_VK_1
#ifdef gl_VertexID
#undef gl_VertexID
#endif
#ifdef gl_InstanceID
#undef gl_InstanceID
#endif
#define gl_VertexID gl_VertexIndex
#define gl_InstanceID gl_InstanceIndex
#endif

BNB_LAYOUT_LOCATION(0) BNB_IN vec3 attrib_pos;
BNB_LAYOUT_LOCATION(1) BNB_IN vec3 attrib_pos_static;
BNB_LAYOUT_LOCATION(2) BNB_IN vec2 attrib_uv;
BNB_LAYOUT_LOCATION(3) BNB_IN vec4 attrib_red_mask;



BNB_OUT(0) vec2 var_uv;
BNB_OUT(1) vec2 var_bg_uv;

BNB_OUT(2+0) vec4 sp0;
BNB_OUT(2+1) vec4 sp1;
BNB_OUT(2+2) vec4 sp2;
BNB_OUT(2+3) vec4 sp3;


invariant gl_Position;

const float dx = 1.0 / 720.0; //640 1125 
const float dy = 1.0 / 1280.0; // 1136 2436 

const float delta = 5.;

const float sOfssetXneg = -delta * dx;
const float sOffsetYneg = -delta * dy;
const float sOffsetXpos = delta * dx;
const float sOffsetYpos = delta * dy;

BNB_OUT(6) vec3 var_left_right;

void main()
{
    float HEAD_X = -0.394;
    float HEAD_Y = 0.065;

    float HEAD_INV_SIZE = 6610.;

    vec2 resolution = bnb_SCREEN.xy;

    if(resolution.x > 1000.) HEAD_INV_SIZE /= 1.22;
    
    mat4 mv = bnb_MV;
    mat4 mvp = bnb_MVP;

    var_uv = attrib_uv;

    vec4 original = mvp * vec4(attrib_pos,1.);
    var_bg_uv  = (original.xy / original.w) * 0.5 + 0.5;

        mat4 mv_no_pos = mv;
    mv_no_pos[3] = vec4(0.,-0.4,-600.,1.);
    original = bnb_PROJ * mv_no_pos*vec4(attrib_pos,1.);

    original = vec4(original.xyz/original.w,1.);

    vec4 center = mvp[3];
    // original.xy -= center.xy/center.w;
    // float s = center.w/HEAD_INV_SIZE;

    original.xy *= 0.08;

    #if defined(BNB_OS_IOS)
        original.xy *= 2.4;
        original.x += 0.01;
    #endif      

    #if defined(BNB_OS_ANDROID)
        original.xy *= 1.75;
        original.x += 0.01;
    #endif   

    original.y += qpos.x/200.;
    // original.x += 5./resolution.x;

    original.xy += vec2(HEAD_X,HEAD_Y);

    original.x -= 0.009/bnb_PROJ[0].x;

    gl_Position = original;
    sp0.xy = var_bg_uv + vec2(sOfssetXneg, sOffsetYneg);
    sp1.xy = var_bg_uv + vec2(sOfssetXneg, sOffsetYpos);
    sp2.xy = var_bg_uv + vec2(sOffsetXpos, sOffsetYneg);
    sp3.xy = var_bg_uv + vec2(sOffsetXpos, sOffsetYpos);
    
    vec2 delta = vec2(dx, dy);
    sp0.zw = var_bg_uv + vec2(-delta.x, -delta.y);
    sp1.zw = var_bg_uv + vec2(delta.x, -delta.y);
    sp2.zw = var_bg_uv + vec2(-delta.x, delta.y);
    sp3.zw = var_bg_uv + vec2(delta.x, delta.y);

    float left_right_factor = mv[0].z;
    vec2 cheek_uv = var_uv;
    cheek_uv.x = (cheek_uv.x*2.-1.)*sign(left_right_factor)*0.5+0.5;
    var_left_right = vec3(cheek_uv,abs(left_right_factor*2.));

#ifdef BNB_VK_1
    sp0.y = 1. - sp0.y;
    sp1.y = 1. - sp1.y;
    sp2.y = 1. - sp2.y;
    sp3.y = 1. - sp3.y;
    sp0.w = 1. - sp0.w;
    sp1.w = 1. - sp1.w;
    sp2.w = 1. - sp2.w;
    sp3.w = 1. - sp3.w;
#endif
#ifdef BNB_VK_1
var_bg_uv.y = 1. - var_bg_uv.y;
#endif
}