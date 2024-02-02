package com.banuba.tech.demo

import com.banuba.sdk.manager.BanubaSdkManager


class Application : android.app.Application() {
    private val BANUBA_CLIENT_TOKEN = <# Client Token #>
    override fun onCreate() {
        super.onCreate()

        BanubaSdkManager.initialize(this, BANUBA_CLIENT_TOKEN)
    }
}