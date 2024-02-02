package com.banuba.tech.demo.camera

import android.content.res.Resources
import android.os.Build
import android.os.Bundle
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.view.WindowInsets
import android.widget.SeekBar
import androidx.core.view.doOnAttach
import androidx.core.view.isVisible
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.banuba.tech.demo.utils.CenterLayoutManager
import com.banuba.tech.demo.R
import com.banuba.tech.demo.databinding.FragmentCameraBinding
import com.banuba.tech.demo.adapters.EffectConfigItemAdapter
import com.banuba.tech.demo.adapters.EffectsCategoryAdapter
import com.banuba.tech.demo.adapters.EffectsGroupAdapter
import com.banuba.tech.demo.adapters.SelectableItem
import com.banuba.tech.demo.data.MediaMode
import com.banuba.tech.demo.data.UIConfig
import com.banuba.tech.demo.dialogs.GesturesInfoDialog
import com.banuba.tech.demo.utils.gone
import com.banuba.tech.demo.utils.hide
import com.banuba.tech.demo.utils.visible

class CameraFragment : Fragment(), TechnologiesBottomSheet.TechnologyListener {
    private var _binding: FragmentCameraBinding? = null
    private val binding get() = _binding!!

    private lateinit var viewModel: CameraViewModel

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentCameraBinding.inflate(inflater, container, false)

        viewModel = ViewModelProvider(requireActivity())[CameraViewModel::class.java]

        return binding.root
    }


    private val effectsCategoryListAdapter by lazy(LazyThreadSafetyMode.NONE) {
        EffectsCategoryAdapter(getWidthOfScreen()) { item, position ->
            viewModel.selectEffectsCategory(item)
            binding.effectsCategoryList.smoothScrollToPosition(position)
        }
    }

    private val effectsGroupListAdapter by lazy(LazyThreadSafetyMode.NONE) {
        EffectsGroupAdapter(getWidthOfScreen()) { item, position ->
            viewModel.selectEffectsGroup(item)
            binding.effectsGroupList.smoothScrollToPosition(position)
        }
    }

    private val effectConfigItemAdapter by lazy(LazyThreadSafetyMode.NONE) {
        EffectConfigItemAdapter(getWidthOfScreen(),
            resources.getDimension(R.dimen.setting_list_item_size).toInt() ) { item, position ->
            binding.effectConfigList.smoothScrollToPosition(position)
            viewModel.selectEffect(item)
        }
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        view.doOnAttach {
            binding.root.setPadding(0,0,0, getBottomInset(it))
        }

        initViews()

        observeData()
    }

    override fun onStart() {
        super.onStart()
        viewModel.attachSurface(binding.surfaceView)
    }

    override fun onStop() {
        super.onStop()
        viewModel.releaseSurface()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onTechnologyClicked(technology: SelectableItem) {
        viewModel.selectTechnology(technology)
    }

    private fun initViews() {
        with(binding) {
            button.setOnClickListener {
                showBottomSheet()
            }

            effectsCategoryList.adapter = effectsCategoryListAdapter
            effectsCategoryList.layoutManager =
                CenterLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false)

            effectsGroupList.adapter = effectsGroupListAdapter
            effectsGroupList.layoutManager =
                CenterLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false)

            effectConfigList.adapter = effectConfigItemAdapter
            effectConfigList.layoutManager =
                CenterLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false)

            btnCameraFacing.setOnClickListener {
                viewModel.changeCameraFacing()
            }

            btnTakePhoto.setOnClickListener {
                viewModel.takePhoto()
            }

            btnClosePhotoEditing.setOnClickListener {
                viewModel.closePhotoEditing()
            }

            imagePreview.setOnTouchListener { _, event ->
                if (event.action == MotionEvent.ACTION_UP) {
                    viewModel.onImagePreviewTouched(event.getPointerId(0), event.x, event.y, event.size)
                }
                true
            }

            seekBar.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener{
                override fun onProgressChanged(seekBar: SeekBar, progress: Int, fromUser: Boolean) {
                    viewModel.setMorphingProgress(progress.toFloat() / seekBar.max)
                }

                override fun onStartTrackingTouch(seekBar: SeekBar) {}

                override fun onStopTrackingTouch(seekBar: SeekBar) {}
            })

            effectSwitch.setOnCheckedChangeListener { _, isChecked ->
                viewModel.setMorphingProgress(if (isChecked) 1F else 0F)
            }

            btnInfo.setOnClickListener {
                showGestureDialog()
            }
        }
    }

    private fun showGestureDialog() {
        GesturesInfoDialog().show(requireActivity().supportFragmentManager, GesturesInfoDialog.TAG)
    }

    private fun observeData() {
        with(viewModel) {
            listOfEffectsCategory.observe(viewLifecycleOwner) {
                effectsCategoryListAdapter.submitList(it)
            }

            listOfEffectsGroup.observe(viewLifecycleOwner) {
                effectsGroupListAdapter.submitList(it)
            }

            listOfEffectConfig.observe(viewLifecycleOwner) {
                effectConfigItemAdapter.submitList(it)
            }

            uiConfig.observe(viewLifecycleOwner) {
                with (binding) {
                    uiConfigGroup.hide()
                    when (it) {
                        UIConfig.EMPTY -> {}
                        UIConfig.SEEKBAR -> {
                            seekBar.progress = 50
                            seekBar.visible()
                        }

                        UIConfig.SEEKBAR_AT_START -> {
                            seekBar.progress = 0
                            seekBar.visible()
                        }

                        UIConfig.SWITCH -> {
                            effectSwitch.isChecked = true
                            effectSwitch.visible()
                        }

                        UIConfig.GESTURES -> {
                            btnInfo.visible()
                            gesturesView.visible()
                        }

                        UIConfig.DISTANCE -> {
                            gesturesView.visible()
                            ivGesture.gone()
                        }
                    }
                }
            }

            mediaMode.observe(viewLifecycleOwner) {
                with (binding) {
                    when (it) {
                        MediaMode.VIDEO -> {
                            imagePreview.gone()
                            btnTakePhoto.gone()
                            btnClosePhotoEditing.gone()
                            btnCameraFacing.visible()
                        }

                        MediaMode.PHOTO -> {
                            imagePreview.gone()
                            btnTakePhoto.visible()
                            btnClosePhotoEditing.gone()
                            btnCameraFacing.visible()
                        }

                        MediaMode.PHOTO_EDITING -> {
                            imagePreview.visible()
                            btnTakePhoto.gone()
                            btnClosePhotoEditing.visible()
                            btnCameraFacing.gone()
                        }
                    }
                }
            }

            gestures.observe(viewLifecycleOwner) {
                binding.tvGesture.setText(it.text)
                if (it.iconRes == null) {
                    binding.ivGesture.gone()
                } else {
                    binding.ivGesture.visible()
                    binding.ivGesture.setImageResource(it.iconRes)
                }
            }

            distanceToPhone.observe(viewLifecycleOwner) {
                binding.tvGesture.text = it
            }

            lifecycleScope.launchWhenStarted {
                showGestureDialogEvent.collect {
                    showGestureDialog()
                }
            }

            lifecycleScope.launchWhenStarted {
                effectCategoryScrollPosition.collect {
                    binding.effectsCategoryList.smoothScrollToPosition(it)
                }
            }

            showSimpleDialog.observe(viewLifecycleOwner) {
                binding.messageContainer.isVisible = it != null
                binding.simpleMessageTV.text = it ?: ""
            }
        }
    }

    private fun getHeightOfScreen() = Resources.getSystem().displayMetrics.heightPixels

    private fun getWidthOfScreen() =  Resources.getSystem().displayMetrics.widthPixels

    private fun showBottomSheet() {
        TechnologiesBottomSheet.newInstance(getHeightOfScreen(), viewModel.listOfTechnology)
            .show(
                childFragmentManager,
                TechnologiesBottomSheet.TAG
            )
    }

    private fun getBottomInset(view: View): Int {
        return when {
            Build.VERSION.SDK_INT >= Build.VERSION_CODES.R -> {
                view.rootWindowInsets.getInsetsIgnoringVisibility(WindowInsets.Type.systemBars()).bottom
            }
            Build.VERSION.SDK_INT >= Build.VERSION_CODES.M -> {
                view.rootWindowInsets?.stableInsetTop ?: 0
            }
            else -> {
                0
            }
        }
    }
}