package com.banuba.tech.demo.data

import androidx.annotation.DrawableRes
import androidx.annotation.StringRes
import com.banuba.tech.demo.R

enum class Gesture(@StringRes val text: Int, @DrawableRes val iconRes: Int?) {
    NO_GESTURE(R.string.no_gesture, null),
    PALM(R.string.palm, R.drawable.ic_gesture_palm),
    VICTORY(R.string.victory, R.drawable.ic_gesture_victory),
    ROCK(R.string.rock, R.drawable.ic_gesture_rock),
    OK(R.string.ok, R.drawable.ic_gesture_ok),
    LIKE(R.string.like, R.drawable.ic_gesture_like)
}