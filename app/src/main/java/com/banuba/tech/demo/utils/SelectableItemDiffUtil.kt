package com.banuba.tech.demo.utils

import androidx.recyclerview.widget.DiffUtil
import com.banuba.tech.demo.adapters.SelectableItem

class SelectableItemDiffUtil: DiffUtil.ItemCallback<SelectableItem>() {
    override fun areItemsTheSame(oldItem: SelectableItem, newItem: SelectableItem): Boolean {
        return oldItem.name == newItem.name
    }

    override fun areContentsTheSame(oldItem: SelectableItem, newItem: SelectableItem): Boolean {
        return oldItem == newItem
    }

    override fun getChangePayload(oldItem: SelectableItem, newItem: SelectableItem): Any? {
        return if (oldItem.isSelected != newItem.isSelected) true else null
    }
}