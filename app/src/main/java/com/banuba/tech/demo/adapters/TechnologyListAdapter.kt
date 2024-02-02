package com.banuba.tech.demo.adapters


import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.core.content.res.ResourcesCompat.getFont
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.banuba.tech.demo.R
import com.banuba.tech.demo.utils.SelectableItemDiffUtil
import com.banuba.tech.demo.databinding.TechnologyListItemBinding


class TechnologyListAdapter(private val clickListener: (SelectableItem) -> Unit)
    : ListAdapter<SelectableItem, TechnologyListAdapter.ItemViewHolder>(SelectableItemDiffUtil())  {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ItemViewHolder {
        return ItemViewHolder(
            TechnologyListItemBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        )
    }

    override fun onBindViewHolder(holder: ItemViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class ItemViewHolder(private val binding: TechnologyListItemBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(item: SelectableItem) = with(binding) {
            nameOfCategory.text = item.name
            if (item.isSelected) {
                nameOfCategory.setTextColor(
                    ContextCompat.getColor(binding.root.context, R.color.black))
                nameOfCategory.typeface = getFont(binding.root.context, R.font.inter_bold)
            } else {
                nameOfCategory.setTextColor(
                    ContextCompat.getColor(binding.root.context, R.color.dove_gray))
                nameOfCategory.typeface = getFont(binding.root.context, R.font.inter_thin)
            }
            root.setOnClickListener {
                clickListener(item)
            }
        }
    }
}

