package com.banuba.tech.demo.data

import androidx.annotation.StringRes

sealed class OneTimeEvent {
    object ShowGestureEvent: OneTimeEvent()
    companion object {
        private const val DIALOG_DELAY = 3000L
    }

    class ShowSimpleDialog(@StringRes val messageRes: Int, val delay : Long = DIALOG_DELAY): OneTimeEvent()
}