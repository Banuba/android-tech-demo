package com.banuba.tech.demo.data

import com.banuba.tech.demo.R
import com.banuba.tech.demo.data.DynamicLinksContent.*

object DataRepository {
    val listOfTechnology = listOf(
        Technology(
            VIRTUAL_TRY_ON.content, listOf(
                EffectsCategory(
                    GLASSES_TRY_ON.content, listOf(
                        EffectsGroup(
                            "Frames", listOf(
                                EffectConfig(R.drawable.ic_glasses, effectPath = "GlassesClear"),
                                EffectConfig(R.drawable.ic_sunglasses, effectPath = "GlassesRayBan")
                            )
                        ),
                        EffectsGroup(
                            "Contact Lenses", listOf(
                                EffectConfig(R.drawable.ic_lens_blue, effectPath = "EyelensesBlue"),
                                EffectConfig(
                                    R.drawable.ic_lens_green,
                                    effectPath = "EyelensesGreen"
                                )
                            )
                        )
                    )
                ),
                EffectsCategory(
                    HEAD_WEARINGS.content, listOf(
                        EffectsGroup(
                            "Headdress", listOf(
                                EffectConfig(R.drawable.ic_headdress, "A", "VTO_Headdresse_01"),
                                EffectConfig(R.drawable.ic_headdress, "B", "VTO_Headdresse_cap")
                            )
                        ),
                        EffectsGroup(
                            "Jewelry", listOf(
                                EffectConfig(R.drawable.ic_empty_effect, effectPath = "Tiara"),
                            )
                        )
                    )
                ),
                EffectsCategory(
                    JEWELRY.content, listOf(
                        EffectsGroup(
                            "Earrings", listOf(
                                EffectConfig(R.drawable.ic_earrings, "A", "Earrings01"),
                                EffectConfig(R.drawable.ic_earrings, "B", "Earrings02")
                            )
                        ),
                        EffectsGroup(
                            "Necklace", listOf(
                                EffectConfig(R.drawable.ic_necklace, "A", "Necklace01"),
                                EffectConfig(R.drawable.ic_necklace, "B", "Necklace02")
                            )
                        )
                    )
                ),
                EffectsCategory(
                    MAKEUP.content, listOf(
                        EffectsGroup(
                            "Face", listOf(
                                EffectConfig(
                                    R.drawable.ic_face, "A", "MakeupBase",
                                    jsConfig = listOf(JsConfig.SimpleConfig(MakeupJSConfig.FOUNDATION_GUCCI.js))
                                ),
                                EffectConfig(
                                    R.drawable.ic_face, "B", "MakeupBase",
                                    jsConfig = listOf(JsConfig.SimpleConfig(MakeupJSConfig.FOUNDATION_LOREAL.js))
                                )
                            )
                        ),
                        EffectsGroup(
                            "Lips", listOf(
                                EffectConfig(
                                    R.drawable.ic_lips, "A", "MakeupBase",
                                    jsConfig = listOf(JsConfig.SimpleConfig(MakeupJSConfig.LIPSTICK_APRICOT.js))
                                ),
                                EffectConfig(
                                    R.drawable.ic_lips, "B", "MakeupBase",
                                    jsConfig = listOf(JsConfig.SimpleConfig(MakeupJSConfig.LIPSTICK_PLUM.js))
                                )
                            )
                        ),
                        EffectsGroup(
                            "Eyes", listOf(
                                EffectConfig(
                                    R.drawable.ic_eys, "A", "MakeupBase",
                                    jsConfig = listOf(JsConfig.SimpleConfig(MakeupJSConfig.EYES_SHADOW_COSNOVA.js))
                                ),
                                EffectConfig(
                                    R.drawable.ic_eys, "B", "MakeupBase",
                                    jsConfig = listOf(JsConfig.SimpleConfig(MakeupJSConfig.EYES_SHADOW_GUCCI.js))
                                )
                            )
                        ),
                        EffectsGroup(
                            "Looks", listOf(
                                EffectConfig(
                                    R.drawable.ic_looks, "A", "MakeupBase",
                                    jsConfig = listOf(JsConfig.SimpleConfig(MakeupJSConfig.LOOK_GUCCI.js))
                                ),
                                EffectConfig(
                                    R.drawable.ic_looks, "B", "MakeupBase",
                                    jsConfig = listOf(JsConfig.SimpleConfig(MakeupJSConfig.LOOK_REVLON.js))
                                )
                            )
                        )
                    )
                ),
                EffectsCategory(
                    HAIR_COLORING.content, listOf(
                        EffectsGroup(
                            "", listOf(
                                EffectConfig(
                                    R.drawable.ic_hair_green,
                                    effectPath = "VTO_Hair_green"
                                ),
                                EffectConfig(R.drawable.ic_hair_blue, effectPath = "VTO_Hair_blue"),
                                EffectConfig(
                                    R.drawable.ic_hair_pink,
                                    effectPath = "VTO_Hair_strand"
                                )
                            )
                        )
                    )
                )
            )
        ),
        Technology(
            TOUCH_UP.content, listOf(
                EffectsCategory(
                    "Skin", listOf(
                        EffectsGroup(
                            "Skin sharpness", listOf(
                                EffectConfig(
                                    R.drawable.ic_empty_effect, effectPath = "SkinSmoothing",
                                    uiConfig = UIConfig.SEEKBAR, jsMethod = "onDataUpdate"
                                ),
                            )
                        ),
                        // TODO: fix the acne removal and restore code below
//                        EffectsGroup(
//                            "Acne", listOf(
//                                EffectConfig(
//                                    R.drawable.ic_empty_effect, effectPath = "test_Acne",
//                                    uiConfig = UIConfig.SEEKBAR, jsMethod = "onDataUpdate",
//                                    requiredMode = MediaMode.PHOTO,
//                                    jsConfig = listOf(
//                                        JsConfig.Background("GetTouchStatus()", 300, R.string.acne_tooltip),
//                                        JsConfig.SimpleConfig("setFitMode(1); resetAcne()")
//                                    )
//                                ),
//                            )
//                        )
                    )
                ),
                EffectsCategory(
                    "Face morphing", listOf(
                        EffectsGroup(
                            "Eyebrows", listOf(
                                EffectConfig(
                                    R.drawable.ic_eyebrows_spacing,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.eyebrows({spacing: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction3
                                    )
                                ),
                                EffectConfig(
                                    R.drawable.ic_eyebrows_height,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.eyebrows({height: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction3
                                    )
                                ),
                                EffectConfig(
                                    R.drawable.ic_eyebrows_bend,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.eyebrows({bend: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction1
                                    )
                                ),
                            )
                        ),
                        EffectsGroup(
                            "Eyes", listOf(
                                EffectConfig(
                                    R.drawable.ic_eyes_rounding,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR_AT_START,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.eyes({rounding: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction2
                                    )
                                ),
                                EffectConfig(
                                    R.drawable.ic_eyes_enlargement,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.eyes({enlargement: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction1
                                    )
                                ),
                                EffectConfig(
                                    R.drawable.ic_eyes_height,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.eyes({height: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction1
                                    )
                                ),
                                EffectConfig(
                                    R.drawable.ic_eyes_spacing,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.eyes({spacing: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction1
                                    )
                                ),
                                EffectConfig(
                                    R.drawable.ic_eyes_squint,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.eyes({squint: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction3
                                    )
                                ),
                                EffectConfig(
                                    R.drawable.ic_eyes_lower_pos,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.eyes({lower_eyelid_pos: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction3
                                    )
                                ),
                                EffectConfig(
                                    R.drawable.ic_eyes_lower_size,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.eyes({lower_eyelid_size: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction3
                                    )
                                ),
                            )
                        ),
                        EffectsGroup(
                            "Nose", listOf(
                                EffectConfig(
                                    R.drawable.ic_nose_width,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.nose({width: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction1
                                    )
                                ),
                                EffectConfig(
                                    R.drawable.ic_nose_height,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.nose({length: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction1
                                    )
                                ),
                                EffectConfig(
                                    R.drawable.ic_nose_tip_width,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.nose({tip_width: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction3
                                    )
                                ),
                            )
                        ),
                        EffectsGroup(
                            "Lips", listOf(
                                EffectConfig(
                                    R.drawable.ic_lips_size,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.lips({size: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction1
                                    )
                                ),
                                EffectConfig(
                                    R.drawable.ic_lips_height,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.lips({height: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction1
                                    )
                                ),
                                EffectConfig(
                                    R.drawable.ic_lips_thickness,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.lips({thickness: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction1
                                    )
                                ),
                                EffectConfig(
                                    R.drawable.ic_lips_mouth_size,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.lips({mouth_size: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction3
                                    )
                                ),
                                EffectConfig(
                                    R.drawable.ic_lips_smile,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR_AT_START,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.lips({smile: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction2
                                    )
                                ),
                                EffectConfig(
                                    R.drawable.ic_lips_shape,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.lips({shape: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction3
                                    )
                                ),
                            )
                        ),
                        EffectsGroup(
                            "Face", listOf(
                                EffectConfig(
                                    R.drawable.ic_face_narrowing,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.face({narrowing: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction1
                                    )
                                ),
                                EffectConfig(
                                    R.drawable.ic_face_v_shape,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.face({v_shape: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction1
                                    )
                                ),
                                EffectConfig(
                                    R.drawable.ic_face_cheekbones_narrowing,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.face({cheekbones_narrowing: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction1
                                    )
                                ),
                                EffectConfig(
                                    R.drawable.ic_face_cheeks_narrowing,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.face({cheeks_narrowing: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction1
                                    )
                                ),
                                EffectConfig(
                                    R.drawable.ic_face_jaw_narrowing,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.face({jaw_narrowing: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction1
                                    )
                                ),
                                EffectConfig(
                                    R.drawable.ic_face_chin_shortening,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.face({chin_shortening: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction1
                                    )
                                ),
                                EffectConfig(
                                    R.drawable.ic_face_chin_narrowing,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.face({chin_narrowing: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction1
                                    )
                                ),
                                EffectConfig(
                                    R.drawable.ic_face_sunken_cheeks,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR_AT_START,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.face({sunken_cheeks: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction2
                                    )
                                ),
                                EffectConfig(
                                    R.drawable.ic_face_cheeks_jaw_narrowing,
                                    effectPath = "Morphings_1.7.0",
                                    uiConfig = UIConfig.SEEKBAR,
                                    morphingConfig = MorphingConfig(
                                        evalJs = "FaceMorph.face({cheeks_jaw_narrowing: %s})",
                                        coefficientConversionFunction = ::coefficientConversionFunction1
                                    )
                                ),
                            )
                        )
                    )
                ),
                EffectsCategory(
                    "Whitening", listOf(
                        EffectsGroup(
                            "Eye Whitening", listOf(
                                EffectConfig(
                                    R.drawable.ic_empty_effect, effectPath = "EyesWitening_Toggle",
                                    uiConfig = UIConfig.SWITCH, jsMethod = "onDataUpdate"
                                ),
                            )
                        ),
                        EffectsGroup(
                            "Tooth Whitening", listOf(
                                EffectConfig(
                                    R.drawable.ic_empty_effect, effectPath = "TeethWitening_Toggle",
                                    uiConfig = UIConfig.SWITCH, jsMethod = "onDataUpdate"
                                ),
                            )
                        )
                    )
                )
            )
        ),
        Technology(
            AR_VIDEO_CALL.content, listOf(
                EffectsCategory(
                    "Background separation", listOf(
                        EffectsGroup(
                            "360 backgrounds", listOf(
                                EffectConfig(
                                    R.drawable.ic_360_background, "A",
                                    effectPath = "360_CubemapEverest_noSound",
                                    jsConfig = listOf(JsConfig.Background(
                                        "onDataUpdate()",
                                        300,
                                        R.string.tilt_your_phone
                                    ))
                                ),
                            )
                        ),
                        EffectsGroup(
                            "AR Background", listOf(
                                EffectConfig(
                                    R.drawable.ic_regular_background, "A",
                                    "RegularDawnOfNature"
                                ),
                                EffectConfig(
                                    R.drawable.ic_regular_background, "B",
                                    "Regular_blur"
                                )
                            )
                        ),
                        EffectsGroup(
                            "Animated Background", listOf(
                                EffectConfig(
                                    R.drawable.ic_video_texture_background, "A",
                                    "video_BG_Metro_sfx"
                                ),
                                EffectConfig(
                                    R.drawable.ic_video_texture_background, "B",
                                    "VideoBGRainyCafe"
                                )
                            )
                        )
                    )
                ),
                EffectsCategory(
                    "Lightning and Color", listOf(
                        EffectsGroup(
                            "", listOf(
                                EffectConfig(
                                    R.drawable.ic_lightning,
                                    text = "A",
                                    effectPath = "prequel_VE"
                                ),
                                EffectConfig(
                                    R.drawable.ic_lightning,
                                    text = "B",
                                    effectPath = "Sunset"
                                ),
                            )
                        )
                    )
                ),
                EffectsCategory(
                    "Touch Up Filters", listOf(
                        EffectsGroup(
                            "No makeup", listOf(
                                EffectConfig(R.drawable.ic_looks, "A", "dialect"),
                                EffectConfig(R.drawable.ic_looks, "B", "WhooshBeautyFemale")
                            )
                        ),
                        EffectsGroup(
                            "Makeup", listOf(
                                EffectConfig(R.drawable.ic_face, "A", "clubs"),
                                EffectConfig(R.drawable.ic_face, "B", "relook")
                            )
                        )
                    )
                ),
                EffectsCategory(
                    "AR Face Masks", listOf(
                        EffectsGroup(
                            "Face morphing", listOf(
                                EffectConfig(R.drawable.ic_mask_nerd, effectPath = "Nerd2"),
                                EffectConfig(
                                    R.drawable.ic_mask_grndma, effectPath = "TrollGrandma",
                                    jsConfig = listOf(JsConfig.SimpleConfig(FaceMasksJSConfig.TROLL_GRANDMA_NO_SOUND.js))
                                ),
                            )
                        ),
                        EffectsGroup(
                            "Skin animation", listOf(
                                EffectConfig(R.drawable.ic_mask_student, effectPath = "Graduate"),
                                EffectConfig(
                                    R.drawable.ic_mask_octopus, effectPath = "CartoonOctopus",
                                    jsConfig = listOf(JsConfig.SimpleConfig(FaceMasksJSConfig.CARTOON_OCTOPUS_NO_SOUND.js))
                                ),
                            )
                        ),
                        EffectsGroup(
                            "Foreground effects", listOf(
                                EffectConfig(R.drawable.ic_mask_frame, effectPath = "frame1"),
                                EffectConfig(
                                    R.drawable.ic_mask_beauty,
                                    effectPath = "RainbowBeauty"
                                ),
                            )
                        )
                    )
                )
            )
        ),
        Technology(
            HAND_TRACKING.content, listOf(
                EffectsCategory(
                    "Gestures Detection", listOf(
                        EffectsGroup(
                            "", listOf(
                                EffectConfig(
                                    R.drawable.ic_empty_effect,
                                    effectPath = "Detection_gestures",
                                    jsConfig = listOf(JsConfig.Gesture("getGesture()", 500)),
                                    uiConfig = UIConfig.GESTURES,
                                    oneTimeEvent = OneTimeEvent.ShowGestureEvent
                                ),
                            )
                        )
                    )
                ),
                EffectsCategory(
                    RINGS_TRY_ON.content, listOf(
                        EffectsGroup(
                            "", listOf(
                                EffectConfig(R.drawable.ic_ring, "A", effectPath = "Ring_01"),
                                EffectConfig(R.drawable.ic_ring, "B", effectPath = "Ring_02"),
                            )
                        )
                    )
                )
            )
        ),
        Technology(
            FACE_MASKS.content, listOf(
                EffectsCategory(
                    "Masks with Morphing", listOf(
                        EffectsGroup(
                            "", listOf(
                                EffectConfig(
                                    R.drawable.ic_mask_grndma, effectPath = "TrollGrandma",
                                    jsConfig = listOf(JsConfig.SimpleConfig(FaceMasksJSConfig.TROLL_GRANDMA_WITH_SOUND.js))
                                ),
                                EffectConfig(R.drawable.ic_bullfighter, effectPath = "Bullfighter"),
                            )
                        )
                    )
                ),
                EffectsCategory(
                    "Triggers", listOf(
                        EffectsGroup(
                            "", listOf(
                                EffectConfig(
                                    R.drawable.ic_mask_octopus, effectPath = "CartoonOctopus",
                                    oneTimeEvent = OneTimeEvent.ShowSimpleDialog(R.string.open_your_mouth),
                                    jsConfig = listOf(JsConfig.SimpleConfig(FaceMasksJSConfig.CARTOON_OCTOPUS_WITH_SOUND.js))
                                ),
                                EffectConfig(
                                    R.drawable.ic_gangster, effectPath = "Gangster",
                                    oneTimeEvent = OneTimeEvent.ShowSimpleDialog(R.string.open_your_mouth)
                                ),
                            )
                        )
                    )
                ),
                EffectsCategory(
                    "Multiple Face Detection", listOf(
                        EffectsGroup(
                            "", listOf(
                                EffectConfig(
                                    R.drawable.ic_minnie, effectPath = "MinnieMouse7_multi",
                                    oneTimeEvent = OneTimeEvent.ShowSimpleDialog(R.string.try_with_friends)
                                ),
                                EffectConfig(
                                    R.drawable.ic_wizard, effectPath = "UnluckyWitch_multi",
                                    oneTimeEvent = OneTimeEvent.ShowSimpleDialog(R.string.try_with_friends)
                                ),
                            )
                        )
                    )
                ),
                EffectsCategory(
                    "Physics", listOf(
                        EffectsGroup(
                            "", listOf(
                                EffectConfig(R.drawable.ic_rabbit, effectPath = "ConfusedRabbit"),
                                EffectConfig(R.drawable.ic_monster, effectPath = "MonsterFlowery")
                            )
                        )
                    )
                ),
                EffectsCategory(
                    "Foreground effects", listOf(
                        EffectsGroup(
                            "", listOf(
                                EffectConfig(R.drawable.ic_retrowave, effectPath = "Retrowave"),
                                EffectConfig(R.drawable.ic_glitch, effectPath = "Glitch2"),
                            )
                        )
                    )
                ),
                EffectsCategory(
                    "Animation", listOf(
                        EffectsGroup(
                            "", listOf(
                                EffectConfig(R.drawable.ic_in_flames, effectPath = "InFlames"),
                                EffectConfig(R.drawable.ic_spider, effectPath = "Spider2"),
                            )
                        )
                    )
                ),
            )
        ),
        Technology(
            FACE_TRACKING.content, listOf(
                EffectsCategory(
                    "Landmarks", listOf(
                        EffectsGroup(
                            "", listOf(
                                EffectConfig(R.drawable.ic_empty_effect, effectPath = "DebugFRX"),
                            )
                        )
                    )
                ),
                EffectsCategory(
                    "Distance to Phone", listOf(
                        EffectsGroup(
                            "", listOf(
                                EffectConfig(
                                    R.drawable.ic_empty_effect,
                                    effectPath = "test_Ruler",
                                    jsConfig = listOf(JsConfig.Distance("onDataUpdate()", 200)),
                                    uiConfig = UIConfig.DISTANCE
                                ),
                            )
                        )
                    )
                ),
                EffectsCategory(
                    "Background/Foreground", listOf(
                        EffectsGroup(
                            "Background", listOf(
                                EffectConfig(R.drawable.ic_empty_effect, effectPath = "BG"),
                            )
                        ),
                        EffectsGroup(
                            "Foreground", listOf(
                                EffectConfig(R.drawable.ic_empty_effect, effectPath = "FG"),
                            )
                        )
                    )
                ),
                EffectsCategory(
                    "Body segmentation", listOf(
                        EffectsGroup(
                            "", listOf(
                                EffectConfig(R.drawable.ic_empty_effect, effectPath = "Full_Body"),
                            )
                        )
                    )
                ),
                EffectsCategory(
                    "Lips segmentation", listOf(
                        EffectsGroup(
                            "", listOf(
                                EffectConfig(R.drawable.ic_empty_effect, effectPath = "Lips"),
                            )
                        )
                    )
                ),
                EffectsCategory(
                    "Eye segmentation", listOf(
                        EffectsGroup(
                            "", listOf(
                                EffectConfig(R.drawable.ic_empty_effect, effectPath = "Eye_lenses"),
                            )
                        )
                    )
                ),
                EffectsCategory(
                    "Hair segmentation", listOf(
                        EffectsGroup(
                            "", listOf(
                                EffectConfig(R.drawable.ic_empty_effect, effectPath = "Hair"),
                            )
                        )
                    )
                ),
                EffectsCategory(
                    "Skin Segmentation", listOf(
                        EffectsGroup(
                            "", listOf(
                                EffectConfig(R.drawable.ic_empty_effect, effectPath = "Skin"),
                            )
                        )
                    )
                )
            )
        ),
        Technology(
            AR_GAMES.content, listOf(
                EffectsCategory(
                    "Game 1", listOf(
                        EffectsGroup(
                            "", listOf(
                                EffectConfig(
                                    R.drawable.ic_empty_effect,
                                    effectPath = "WhatAnimalAreYou"
                                ),
                            )
                        )
                    )
                ),
                EffectsCategory(
                    "Game 2", listOf(
                        EffectsGroup(
                            "", listOf(
                                EffectConfig(
                                    R.drawable.ic_empty_effect,
                                    effectPath = "WhatBunnyAreYou"
                                ),
                            )
                        )
                    )
                ),
                EffectsCategory(
                    "Game 3", listOf(
                        EffectsGroup(
                            "", listOf(
                                EffectConfig(
                                    R.drawable.ic_empty_effect,
                                    effectPath = "FlappyPlane_mouth"
                                ),
                            )
                        )
                    )
                )
            )
        ),
        Technology(
            "Avatar", listOf(
                EffectsCategory(
                    "Avatar 1", listOf(
                        EffectsGroup(
                            "", listOf(
                                EffectConfig(
                                    R.drawable.ic_empty_effect,
                                    effectPath = "Hades"
                                ),
                            )
                        )
                    )
                ),
                EffectsCategory(
                    "Avatar 2", listOf(
                        EffectsGroup(
                            "", listOf(
                                EffectConfig(
                                    R.drawable.ic_empty_effect,
                                    effectPath = "ActionunitsRabbit"
                                ),
                            )
                        )
                    )
                )
            )
        )
    )

    private fun coefficientConversionFunction1(x: Float): Float = 2 * x - 1

    private fun coefficientConversionFunction2(x: Float): Float = x

    private fun coefficientConversionFunction3(x: Float): Float = -2 * x + 1

    fun convertDynamicLinkKeyToContent(key: String) = convertKeyToValue(key)

    private fun convertKeyToValue(input: String): String {
        return enumValues<DynamicLinksContent>()
            .firstOrNull { it.key == input }?.content ?: ""
    }

    private lateinit var selectedCategoryList: List<EffectsCategory>
    fun getListOfEffectCategories(technologyName: String): List<EffectsCategory> {
        selectedCategoryList =
            listOfTechnology
                .find { it.name == technologyName }?.listOfEffectsCategories ?: emptyList()
        return selectedCategoryList
    }

    private lateinit var selectedGroupList: List<EffectsGroup>
    fun getListOfEffectGroups(effectsCategoryName: String): List<EffectsGroup> {
        selectedGroupList =
            selectedCategoryList
                .find { it.nameOfCategory == effectsCategoryName }?.lisOfEffectsGroup ?: emptyList()
        return selectedGroupList
    }

    fun getEffectConfigs(effectsGroupName: String) =
        selectedGroupList
            .find { it.nameOfGroup == effectsGroupName }?.effectsConfigList ?: emptyList()
}