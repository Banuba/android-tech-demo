package com.banuba.tech.demo.data

data class EffectsCategory(
    val nameOfCategory: String,
    val lisOfEffectsGroup: List<EffectsGroup> = emptyList()
)
