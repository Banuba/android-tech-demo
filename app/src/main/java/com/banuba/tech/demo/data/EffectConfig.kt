package com.banuba.tech.demo.data

import androidx.annotation.DrawableRes

data class EffectConfig(
    @DrawableRes
    val resourceId: Int,
    val text: String = "",
    val effectPath: String,
    val requiredMode: MediaMode = MediaMode.VIDEO,
    val jsConfig: List<JsConfig> = listOf(),
    val uiConfig: UIConfig = UIConfig.EMPTY,
    val jsMethod: String = "",
    val morphingConfig: MorphingConfig? = null,
    val oneTimeEvent: OneTimeEvent? = null
)
