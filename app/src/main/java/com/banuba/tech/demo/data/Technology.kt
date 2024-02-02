package com.banuba.tech.demo.data

data class Technology(
    val name: String,
    val listOfEffectsCategories: List<EffectsCategory> = emptyList()
)
