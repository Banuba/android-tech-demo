package com.banuba.tech.demo.camera

import android.annotation.SuppressLint
import android.app.Application
import android.net.Uri
import android.view.SurfaceView
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.banuba.sdk.effect_player.Effect
import com.banuba.sdk.frame.FramePixelBuffer
import com.banuba.sdk.input.CameraDevice
import com.banuba.sdk.input.CameraDeviceConfigurator
import com.banuba.sdk.input.CameraInput
import com.banuba.sdk.input.IInput
import com.banuba.sdk.input.PhotoInput
import com.banuba.sdk.manager.BanubaSdkManager
import com.banuba.sdk.output.FrameOutput
import com.banuba.sdk.output.IOutput
import com.banuba.sdk.output.SurfaceOutput
import com.banuba.sdk.player.Player
import com.banuba.sdk.player.PlayerTouchListener
import com.banuba.sdk.types.Touch
import com.banuba.tech.demo.R
import com.banuba.tech.demo.adapters.SelectableItem
import com.banuba.tech.demo.data.DataRepository
import com.banuba.tech.demo.data.DynamicLinksContent
import com.banuba.tech.demo.data.EffectConfig
import com.banuba.tech.demo.data.Gesture
import com.banuba.tech.demo.data.JsConfig
import com.banuba.tech.demo.data.MediaMode
import com.banuba.tech.demo.data.OneTimeEvent
import com.banuba.tech.demo.data.SelectableEffectConfig
import com.banuba.tech.demo.data.UIConfig
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import java.text.DecimalFormat
import java.text.DecimalFormatSymbols


class CameraViewModel(application: Application) : AndroidViewModel(application) {

    companion object {
        private const val TAKE_PHOTO_TOOLTIP_DELAY = 5000L
        private const val VOLUME_ON = 1f
        private const val VOLUME_OFF = 0f
    }

    private var cameraDevice: CameraDevice? = null
    private var surfaceOutput: SurfaceOutput? = null

    private val player by lazy(LazyThreadSafetyMode.NONE) {
        Player()
    }

    private var _listOfTechnology = listOf<SelectableItem>()
    val listOfTechnology: List<SelectableItem>
        get() = _listOfTechnology

    private val _listOfEffectsCategory = MutableLiveData(listOf<SelectableItem>())
    val listOfEffectsCategory: LiveData<List<SelectableItem>>
        get() = _listOfEffectsCategory

    private val _listOfEffectsGroup = MutableLiveData(listOf<SelectableItem>())
    val listOfEffectsGroup: LiveData<List<SelectableItem>>
        get() = _listOfEffectsGroup

    private val _listOfEffectConfig = MutableLiveData(listOf<SelectableEffectConfig>())
    val listOfEffectConfig: LiveData<List<SelectableEffectConfig>>
        get() = _listOfEffectConfig

    private val _uiConfig = MutableLiveData<UIConfig>()
    val uiConfig: LiveData<UIConfig>
        get() = _uiConfig

    private val _mediaMode = MutableLiveData<MediaMode>()
    val mediaMode: LiveData<MediaMode>
        get() = _mediaMode

    private val _gestures = MutableLiveData(Gesture.NO_GESTURE)
    val gestures: LiveData<Gesture>
        get() = _gestures

    private val _showGestureDialogEvent = MutableSharedFlow<Unit>(replay = 0)
    val showGestureDialogEvent: SharedFlow<Unit> = _showGestureDialogEvent

    private val _showSimpleDialog = MutableLiveData<String?>(null)
    val showSimpleDialog: LiveData<String?>
        get() = _showSimpleDialog

    private val _distanceToPhone = MutableLiveData<String>()
    val distanceToPhone: LiveData<String>
        get() = _distanceToPhone

    private val _effectCategoryScrollPosition = MutableSharedFlow<Int>(replay = 0)
    val effectCategoryScrollPosition: SharedFlow<Int> = _effectCategoryScrollPosition


    private var cameraFacing = CameraDeviceConfigurator.LensSelector.FRONT

    private var maskCallbackJobs: MutableList<Job> = mutableListOf()
    private var oneTimeEventJob: Job? = null

    private var hasPhotoTooltipShowed: Boolean = false

    private var previewFramePixelBuffer: FramePixelBuffer? = null

    fun openCamera(lifecycleOwner: LifecycleOwner) {
        cameraDevice = CameraDevice(getApplication<Application>(), lifecycleOwner)
        player.use(CameraInput(cameraDevice!!))
        cameraDevice!!.start()
        player.play()
    }

    fun closeCamera() {
        if (cameraDevice != null) {
            player.use(null as IInput?)
            cameraDevice!!.close()
        }
        player.pause()
    }

    fun changeCameraFacing() {
        cameraFacing = if (cameraFacing == CameraDeviceConfigurator.LensSelector.BACK) {
            CameraDeviceConfigurator.LensSelector.FRONT
        } else {
            CameraDeviceConfigurator.LensSelector.BACK
        }
        cameraDevice!!.configurator.setLens(cameraFacing).commit()
    }

    fun takePhoto() {
        closeTooltip()

        applyEffect(selectedEffect)

        val photoInput = PhotoInput()
        player.use(photoInput)
        photoInput.take(cameraDevice!!, null)
        captureNextFrame()
        cameraDevice!!.stop()

        _mediaMode.value = MediaMode.PHOTO_EDITING
    }

    private fun captureNextFrame() {
        val frameOutput = FrameOutput(object : FrameOutput.IFramePixelBufferProvider {
            override fun onFrame(output: IOutput?, frame: FramePixelBuffer?) {
                previewFramePixelBuffer = frame
                val self = output as FrameOutput
                player.removeOutput(self)
                self.close()
            }
        })
        player.addOutput(frameOutput)
    }

    fun closePhotoEditing() {
        resetEffect()
        _mediaMode.value = MediaMode.PHOTO
    }

    private fun endPhotoEditing() {
        player.loadAsync("")
        player.use(CameraInput(cameraDevice!!))
        cameraDevice!!.start()
        previewFramePixelBuffer = null
    }

    fun onImagePreviewTouched(touchId : Int, touchX: Float, touchY: Float, size: Float) {
        val map: HashMap<Long, Touch> = HashMap(1)
        map[touchId.toLong()] = Touch(touchX, touchY, size.toLong())
        player.effectPlayer.inputManager?.onTouchesEnded(map)

        val frame = previewFramePixelBuffer
        if (frame != null) {
            val photoInput = PhotoInput()
            player.use(photoInput)
            photoInput.take(frame)
            captureNextFrame()
        }
    }

    fun selectTechnology(technology: SelectableItem, selectFirstCategory: Boolean = true) {
        _listOfTechnology = selectItem(_listOfTechnology, technology) {
            updateListOfEffectsCategory(it, selectFirstCategory)
        }
    }

    fun handleDynamicLink(link: Uri) {
        val parseResult = link.toDynamicLinkParsResult()

        if (parseResult.technology.isNotEmpty()) {
            selectTechnology(
                SelectableItem(parseResult.technology, false),
                parseResult.category != DynamicLinksContent.RINGS_TRY_ON.content
            )
        }


        if (parseResult.category.isNotEmpty()) {
            selectEffectsCategory(SelectableItem(parseResult.category, false))
            listOfEffectsCategory.value?.indexOfFirst { it.name == parseResult.category }
                ?.let { index ->
                    viewModelScope.launch {
                        _effectCategoryScrollPosition.emit(index)
                    }
                }
        }
    }

    fun selectEffectsCategory(effectsCategory: SelectableItem) {
        resetEffect()
        _listOfEffectsCategory.value = selectItem(
            _listOfEffectsCategory.value ?: emptyList(),
            effectsCategory, ::updateListOfEffectGroup
        )
    }

    fun selectEffectsGroup(effectsGroup: SelectableItem) {
        _listOfEffectsGroup.value = selectItem(
            _listOfEffectsGroup.value ?: emptyList(),
            effectsGroup, ::updateListOfEffectConfig
        )
    }


    private lateinit var selectedEffect: EffectConfig

    fun selectEffect(selectableEffectConfig: SelectableEffectConfig) {
        _listOfEffectConfig.value = _listOfEffectConfig.value?.map {
            SelectableEffectConfig(
                isSelected = it.effectConfig == selectableEffectConfig.effectConfig,
                effectConfig = it.effectConfig
            )
        } ?: emptyList()
        selectedEffect = selectableEffectConfig.effectConfig
        prepareEffect(selectableEffectConfig.effectConfig)
    }

    @SuppressLint("ClickableViewAccessibility")
    fun attachSurface(surface: SurfaceView) {
        surfaceOutput = SurfaceOutput(surface.holder)
        player.addOutput(surfaceOutput!!)
        player.effectPlayer.effectManager()!!.setEffectVolume(VOLUME_ON)
        surface.setOnTouchListener(PlayerTouchListener(getApplication<Application>(), player))
    }

    fun releaseSurface() {
        if (surfaceOutput != null) {
            player.removeOutput(surfaceOutput!!)
            surfaceOutput!!.close()
            surfaceOutput = null
        }
        player.effectPlayer.effectManager()?.setEffectVolume(VOLUME_OFF)
    }

    private val decimalFormatSymbols by lazy {
        DecimalFormatSymbols.getInstance().apply {
            decimalSeparator = '.'
        }
    }

    fun setMorphingProgress(float: Float) {
        if (selectedEffect.jsMethod.isNotEmpty()) {
            appliedEffect?.callJsMethod(selectedEffect.jsMethod, float.toString())
        }
        selectedEffect.morphingConfig?.let { morphingConfig ->
            val formattedValue = DecimalFormat(
                "0.00",
                decimalFormatSymbols
            ).format(morphingConfig.coefficientConversionFunction.invoke(float))

            appliedEffect?.evalJs(String.format(morphingConfig.evalJs, formattedValue), null)
        }
    }

    private var appliedEffect: Effect? = null

    private fun closeTooltip() {
        oneTimeEventJob?.cancel()
        oneTimeEventJob = null
        _showSimpleDialog.value = null
    }
    private fun resetEffect() {
        player.loadAsync("")
        if (_mediaMode.value == MediaMode.PHOTO_EDITING) {
            endPhotoEditing()
        }
        _mediaMode.value = MediaMode.VIDEO
        _uiConfig.value = UIConfig.EMPTY

        maskCallbackJobs.forEach {
            it.cancel()
        }
        maskCallbackJobs.clear()
        closeTooltip()
    }

    private fun prepareEffect(effectData: EffectConfig) {
        resetEffect()

        _mediaMode.value = effectData.requiredMode
        when (effectData.requiredMode) {
            MediaMode.PHOTO -> {
                if (!hasPhotoTooltipShowed) {
                    hasPhotoTooltipShowed = true
                    handleOneTimeEvent(OneTimeEvent.ShowSimpleDialog(R.string.take_photo, TAKE_PHOTO_TOOLTIP_DELAY))
                }
            }
            MediaMode.VIDEO, MediaMode.PHOTO_EDITING -> {
                applyEffect(effectData)
            }
        }
    }

    private fun applyEffect(effectData: EffectConfig) {
        _uiConfig.value = effectData.uiConfig
        appliedEffect = player.loadAsync(
            if (effectData.effectPath.isEmpty()) "" else buildPath(effectData.effectPath)
        )

        effectData.jsConfig.forEach {
            handleJsConfigOfEffect(it)
        }

        effectData.oneTimeEvent?.let { oneTimeEvent ->
            handleOneTimeEvent(oneTimeEvent)
        }

    }

    private fun handleJsConfigOfEffect(jsConfig: JsConfig) {
        when (jsConfig) {
            is JsConfig.Distance -> {
                maskCallbackJobs.add(viewModelScope.launch {
                    while (true) {
                        appliedEffect?.evalJs(jsConfig.evalJs) {
                            _distanceToPhone.postValue("Distance: $it cm")
                        }
                        delay(jsConfig.delay)
                    }
                })
            }

            is JsConfig.Gesture -> {
                maskCallbackJobs.add(viewModelScope.launch {
                    while (true) {
                        appliedEffect?.evalJs(jsConfig.evalJs) {
                            _gestures.postValue(parseGesture(it))
                        }
                        delay(jsConfig.delay)
                    }
                })
            }

            is JsConfig.SimpleConfig -> {
                appliedEffect?.evalJs(jsConfig.jsConfig, null)
            }

            is JsConfig.Background -> {
                val message = getApplication<Application>()
                    .applicationContext.getString(jsConfig.messageRes)
                maskCallbackJobs.add(viewModelScope.launch {
                    while (isActive) {
                        appliedEffect?.evalJs(jsConfig.evalJs) {
                            // Need check here to prevent changing dialog text on effect change while executing js code
                            // Because onResult callback is not cancellable by itself
                            if (!isActive) {
                                return@evalJs
                            }

                            if (it.toBoolean()) {
                                _showSimpleDialog.postValue(null)
                            } else {
                                _showSimpleDialog.postValue(message)
                            }
                        }
                        delay(jsConfig.delay)
                    }
                })
            }
        }
    }

    private fun handleOneTimeEvent(oneTimeEvent : OneTimeEvent) {
        oneTimeEventJob = viewModelScope.launch {
            when (oneTimeEvent) {
                is OneTimeEvent.ShowGestureEvent -> {
                    _showGestureDialogEvent.emit(Unit)
                }

                is OneTimeEvent.ShowSimpleDialog -> {
                    _showSimpleDialog.value = getApplication<Application>()
                        .applicationContext.getString(oneTimeEvent.messageRes)
                    delay(oneTimeEvent.delay)
                    _showSimpleDialog.value = null
                }
            }
        }
    }

    private fun updateListOfEffectConfig(effectsGroup: SelectableItem) {
        val listOfConfigs = DataRepository.getEffectConfigs(effectsGroup.name).map {
            SelectableEffectConfig(false, it)
        }
        if (listOfConfigs.size == 1) {
            _listOfEffectConfig.value = emptyList()
        } else {
            _listOfEffectConfig.value = listOfConfigs
        }

        if (listOfConfigs.isNotEmpty()) {
            selectEffect(listOfConfigs.first())
        }
    }

    private fun updateListOfEffectGroup(effectsCategory: SelectableItem) {
        val groupList = DataRepository.getListOfEffectGroups(effectsCategory.name)
        val selectableItemList = groupList.map { group ->
            SelectableItem(group.nameOfGroup, false)
        }
        if (selectableItemList.size == 1) {
            _listOfEffectsGroup.value = emptyList()
            selectEffectsGroup(selectableItemList.first())
        } else {
            _listOfEffectsGroup.value = selectableItemList
            _listOfEffectConfig.value = emptyList()
        }
    }

    private fun updateListOfEffectsCategory(
        technology: SelectableItem,
        selectFirstCategory: Boolean
    ) {
        val categoryList = DataRepository.getListOfEffectCategories(technology.name)
        val selectableItemList = categoryList.map { category ->
            SelectableItem(category.nameOfCategory, false)
        }
        if (selectableItemList.size == 1) {
            _listOfEffectsCategory.value = emptyList()
        } else {
            _listOfEffectsCategory.value = selectableItemList
        }

        selectableItemList.firstOrNull()?.let {
            if (selectFirstCategory) {
                selectEffectsCategory(it)
            }
        }
    }

    private fun selectItem(
        list: List<SelectableItem>, item: SelectableItem,
        itemSelectedCallback: (SelectableItem) -> Unit
    ): List<SelectableItem> {
        return if (list.find { it.name == item.name }?.isSelected != true) {
            itemSelectedCallback(item)
            list.map {
                it.copy(isSelected = it.name == item.name)
            }
        } else {
            list
        }
    }

    private fun parseGesture(gestureString: String) =
        enumByNameIgnoreCase(gestureString, Gesture.NO_GESTURE)

    init {
        _listOfTechnology = DataRepository.listOfTechnology.map {
            SelectableItem(it.name, false)
        }
        _listOfTechnology.firstOrNull()?.let {
            selectTechnology(it)
        }
    }

    fun buildPath(maskName: String): String {
        return Uri.parse(BanubaSdkManager.getResourcesBase())
            .buildUpon()
            .appendPath("effects")
            .appendPath(maskName)
            .build()
            .toString()
    }
}

inline fun <reified T : Enum<T>> enumByNameIgnoreCase(input: String, default: T): T {
    return enumValues<T>().firstOrNull { it.name.equals(input, true) } ?: default
}