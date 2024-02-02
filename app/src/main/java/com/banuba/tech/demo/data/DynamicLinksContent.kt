package com.banuba.tech.demo.data

enum class DynamicLinksContent(val key: String, val content: String) {
    VIRTUAL_TRY_ON("virtual_try_on", "Virtual Try On"),
    TOUCH_UP( "beauty_touch_up" , "Touch UP"),
    AR_VIDEO_CALL("ar_videocall", "AR VideoCall"),
    HAND_TRACKING("hand_tracking", "Hand Tracking"),
    FACE_MASKS( "face_masks", "Face Masks"),
    FACE_TRACKING("face_tracking", "Face Tracking"),
    AR_GAMES("ar_games", "AR Games"),

    GLASSES_TRY_ON("glasses", "Glasses Try On"),
    HEAD_WEARINGS("head_wearings", "Head Wearings"),
    JEWELRY("jewelry", "Jewelry"),
    MAKEUP("makeup", "Makeup"),
    HAIR_COLORING("hair", "Hair Coloring"),
    RINGS_TRY_ON("rings", "Rings try on")
}