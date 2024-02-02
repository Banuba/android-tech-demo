package com.banuba.tech.demo.adapters

import android.os.Parcelable
import kotlinx.android.parcel.Parcelize

@Parcelize
data class SelectableItem (
    val name: String,
    val isSelected: Boolean
    ) : Parcelable