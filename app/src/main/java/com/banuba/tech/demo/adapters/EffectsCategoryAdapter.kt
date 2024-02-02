package com.banuba.tech.demo.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.view.isVisible
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.banuba.tech.demo.utils.SelectableItemDiffUtil
import com.banuba.tech.demo.databinding.EffectsCategoryItemBinding
import com.banuba.tech.demo.utils.getTextViewWidth
import com.banuba.tech.demo.utils.setHorizontalMargins

class EffectsCategoryAdapter (private val mScreenWidth: Int,
                              private val itemSelected: (SelectableItem, Int) -> Unit):
    ListAdapter<SelectableItem, EffectsCategoryAdapter.ItemViewHolder>(SelectableItemDiffUtil()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ItemViewHolder {
        return ItemViewHolder(
            EffectsCategoryItemBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        )
    }

    override fun onBindViewHolder(holder: ItemViewHolder, position: Int) {
        holder.itemView.setHorizontalMargins( 0, 0)
        if (position == 0) {
            holder.itemView.setHorizontalMargins(
                mScreenWidth / 2 - getTextViewWidth(holder.binding.info, getItem(position).name) / 2,
                0)

        }
        if (position == itemCount - 1) {
            holder.itemView.setHorizontalMargins(
                0,
                mScreenWidth / 2 - getTextViewWidth(holder.binding.info, getItem(position).name) / 2
            )
        }
        holder.bind(getItem(position), position)
    }

    override fun onBindViewHolder(holder: ItemViewHolder, position: Int, payloads: MutableList<Any>) {
        if (payloads.isEmpty()) {
            super.onBindViewHolder(holder, position, payloads)
        } else {
            if (payloads[0] == true) {
                holder.bindSelectedState(getItem(position).isSelected)
            }
        }
    }

    inner class ItemViewHolder(val binding: EffectsCategoryItemBinding)
        : RecyclerView.ViewHolder(binding.root) {

        fun bind(item: SelectableItem, position: Int) = with(binding) {
            info.text = item.name

            selector.isVisible = item.isSelected

            root.setOnClickListener {
                itemSelected(item, position)
            }
        }

        fun bindSelectedState(isSelected: Boolean) {
            binding.selector.isVisible = isSelected
        }
    }
}