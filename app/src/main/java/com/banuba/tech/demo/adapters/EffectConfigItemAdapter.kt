package com.banuba.tech.demo.adapters

import android.util.Log
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.view.isVisible
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.banuba.tech.demo.data.EffectConfig
import com.banuba.tech.demo.data.SelectableEffectConfig
import com.banuba.tech.demo.databinding.MaskSettingsListItemBinding
import com.banuba.tech.demo.utils.setHorizontalMargins

class EffectConfigItemAdapter(
    private val mScreenWidth: Int,
    private val mElementMaxWidth: Int,
    private val itemSelected: (SelectableEffectConfig, Int) -> Unit
) : ListAdapter<SelectableEffectConfig, EffectConfigItemAdapter.ItemViewHolder>(DiffCallback())  {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ItemViewHolder {
        return ItemViewHolder(
            MaskSettingsListItemBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        )
    }

    override fun onBindViewHolder(holder: ItemViewHolder, position: Int) {
        holder.itemView.setHorizontalMargins(0, 0)
        if (position == 0) {
            holder.itemView.setHorizontalMargins(
                mScreenWidth / 2 - mElementMaxWidth / 2,
                30
            )
        }
        if (position == itemCount - 1) {
            holder.itemView.setHorizontalMargins(
                30,
                mScreenWidth / 2 - mElementMaxWidth / 2
            )
        }
        holder.bind(getItem(position), position)
    }

    inner class ItemViewHolder(private val binding: MaskSettingsListItemBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(item: SelectableEffectConfig, position: Int) = with(binding) {
            selectedBackground.isVisible = item.isSelected

            image.setImageResource(item.effectConfig.resourceId)

            group.isVisible = item.effectConfig.text.isNotEmpty()
            text.text = item.effectConfig.text

            root.setOnClickListener {
                itemSelected(item, position)
            }
        }
    }

    private class DiffCallback : DiffUtil.ItemCallback<SelectableEffectConfig>() {
        override fun areItemsTheSame(oldItem: SelectableEffectConfig,
                                     newItem: SelectableEffectConfig): Boolean {
            return oldItem.effectConfig == newItem.effectConfig
        }

        override fun areContentsTheSame(oldItem: SelectableEffectConfig,
                                        newItem: SelectableEffectConfig): Boolean {
            return oldItem == newItem
        }
    }
}