package com.banuba.tech.demo.camera

import android.net.Uri
import com.banuba.tech.demo.data.DataRepository

data class DynamicLinkParsResult (
        val technology: String,
        val category: String)

private const val TECHNOLOGY = "technology"
private const val CATEGORY = "category"

fun Uri.toDynamicLinkParsResult(): DynamicLinkParsResult {
        val technologyLink = this.getQueryParameter(TECHNOLOGY) ?: ""
        val categoryLink = this.getQueryParameter(CATEGORY) ?: ""

        val technology = DataRepository.convertDynamicLinkKeyToContent(technologyLink)
        val category = DataRepository.convertDynamicLinkKeyToContent(categoryLink)

        return DynamicLinkParsResult(technology, category)
}