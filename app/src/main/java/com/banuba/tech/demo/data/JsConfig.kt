package com.banuba.tech.demo.data

import androidx.annotation.StringRes

sealed class JsConfig {
    class Gesture(val evalJs: String, val delay: Long) : JsConfig()
    class Distance(val evalJs: String, val delay: Long) : JsConfig()
    class SimpleConfig(val jsConfig: String) : JsConfig()
    class Background(val evalJs: String, val delay: Long, @StringRes val messageRes: Int) : JsConfig()
}
