package com.banuba.tech.demo.utils

import android.view.View
import android.view.ViewGroup
import android.widget.TextView

fun View.setHorizontalMargins(l: Int, r: Int) {
    if (this.layoutParams is ViewGroup.MarginLayoutParams) {
        val p = this.layoutParams as ViewGroup.MarginLayoutParams
        p.setMargins(l, 0, r, 0)
        this.requestLayout()
    }
}

fun getTextViewWidth(textView: TextView, text: String): Int {
    textView.text = text
    textView.measure(0,0)
    return textView.measuredWidth
}

fun View.visible() {
    visibility = View.VISIBLE
}


fun View.gone() {
    visibility = View.GONE
}

fun View.hide() {
    visibility = View.INVISIBLE
}