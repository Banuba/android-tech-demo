package com.banuba.tech.demo.adapters

import android.graphics.Color
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.banuba.tech.demo.R
import com.banuba.tech.demo.utils.SelectableItemDiffUtil
import com.banuba.tech.demo.databinding.EffectsGroupItemBinding
import com.banuba.tech.demo.utils.getTextViewWidth
import com.banuba.tech.demo.utils.setHorizontalMargins

class EffectsGroupAdapter (private val mScreenWidth: Int,
                           private val itemSelected: (SelectableItem, Int) -> Unit):
    ListAdapter<SelectableItem, EffectsGroupAdapter.ItemViewHolder>(SelectableItemDiffUtil()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ItemViewHolder {
        return ItemViewHolder(
            EffectsGroupItemBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        )
    }

    override fun onBindViewHolder(holder: ItemViewHolder, position: Int) {
        holder.itemView.setHorizontalMargins(0, 0)
        if (position == 0) {
            holder.itemView.setHorizontalMargins(
                mScreenWidth / 2 - getTextViewWidth(holder.binding.info, getItem(position).name) / 2,
                0
            )
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

    inner class ItemViewHolder(val binding: EffectsGroupItemBinding)
        : RecyclerView.ViewHolder(binding.root) {

        fun bind(item: SelectableItem, position: Int) = with(binding) {
            info.text = item.name

            setTextBackground(item.isSelected)

            root.setOnClickListener {
                itemSelected(item, position)
            }
        }

        fun bindSelectedState(isSelected: Boolean) {
            setTextBackground(isSelected)
        }

        private fun setTextBackground(isSelected: Boolean) {
            if (isSelected) {
                binding.info.setBackgroundResource(R.drawable.oval_selector)
            } else {
                binding.info.setBackgroundColor(Color.TRANSPARENT)
            }

        }
    }
}