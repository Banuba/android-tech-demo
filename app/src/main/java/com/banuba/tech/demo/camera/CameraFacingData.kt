package com.banuba.tech.demo.camera

import com.banuba.sdk.camera.Facing

enum class CameraFacing (
    val facing: Facing,
    val mirroring: Boolean
    ) {
    FRONT(Facing.FRONT, true),
    BACK(Facing.BACK, false)
}