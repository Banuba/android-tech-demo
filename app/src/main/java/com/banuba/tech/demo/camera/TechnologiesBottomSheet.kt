package com.banuba.tech.demo.camera

import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.Window
import android.view.WindowManager
import androidx.core.os.bundleOf
import com.banuba.tech.demo.adapters.SelectableItem
import com.banuba.tech.demo.adapters.TechnologyListAdapter
import com.banuba.tech.demo.databinding.TechnologiesBottomSheetBinding
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.bottomsheet.BottomSheetDialogFragment


class TechnologiesBottomSheet : BottomSheetDialogFragment() {

    interface TechnologyListener {
        fun onTechnologyClicked(technology: SelectableItem)
    }

    companion object {
        const val TAG = "TechnologiesBottomSheet"

        const val HEIGHT_OF_DIALOG = "HEIGHT_OF_DIALOG"
        const val LIST_OF_TECHNOLOGIES = "LIST_OF_TECHNOLOGIES"

        fun newInstance(
            height: Int,
            listOfTechnologies: List<SelectableItem>
        ): TechnologiesBottomSheet {
            return TechnologiesBottomSheet().apply {
                arguments = bundleOf(
                    HEIGHT_OF_DIALOG to height,
                    LIST_OF_TECHNOLOGIES to listOfTechnologies
                )
            }
        }
    }

    private val heightOfDialog by lazy(LazyThreadSafetyMode.NONE) {
        requireArguments().getInt(HEIGHT_OF_DIALOG)
    }

    private val technologies: ArrayList<SelectableItem> by lazy(LazyThreadSafetyMode.NONE) {
        requireArguments().getParcelableArrayList<SelectableItem>(LIST_OF_TECHNOLOGIES) as ArrayList<SelectableItem>
    }

    private val technologyListAdapter = TechnologyListAdapter {
        technologyListener?.onTechnologyClicked(it)
        dismiss()
    }

    private var technologyListener: TechnologyListener? = null

    private var _binding: TechnologiesBottomSheetBinding? = null
    private val binding get() = _binding!!

    override fun onCreateDialog(savedInstanceState: Bundle?) = BottomSheetDialog(
        requireContext(),
        theme
    ).apply {

        requestWindowFeature(Window.FEATURE_NO_TITLE)

        setOnShowListener {
            findViewById<View>(com.google.android.material.R.id.design_bottom_sheet)?.run {
                layoutParams.height = WindowManager.LayoutParams.MATCH_PARENT
                requestLayout()
                BottomSheetBehavior.from(this).peekHeight = heightOfDialog
            }
        }
    }

    override fun onAttach(context: Context) {
        super.onAttach(context)

        try {
            technologyListener = parentFragment as TechnologyListener?
        } catch (e: ClassCastException) {
            Log.e(TAG, "Can not cast to listener", e)
        }
    }

    override fun onDetach() {
        super.onDetach()
        technologyListener = null
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        super.onCreateView(inflater, container, savedInstanceState)
        _binding = TechnologiesBottomSheetBinding.inflate(inflater)
        return binding.root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.buttonClose.setOnClickListener {
            dismiss()
        }

        binding.technologyList.adapter = technologyListAdapter

        technologyListAdapter.submitList(technologies)
    }
}