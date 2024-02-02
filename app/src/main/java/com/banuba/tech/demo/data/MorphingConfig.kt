package com.banuba.tech.demo.data

data class MorphingConfig(
    val evalJs: String,
    val coefficientConversionFunction: (Float) -> Float
)
