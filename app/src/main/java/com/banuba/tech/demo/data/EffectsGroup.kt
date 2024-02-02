package com.banuba.tech.demo.data

data class EffectsGroup(
    val nameOfGroup: String,
    val effectsConfigList: List<EffectConfig> = emptyList()
)
