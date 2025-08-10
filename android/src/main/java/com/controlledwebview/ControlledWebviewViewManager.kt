package com.controlledwebview

import android.graphics.Color
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.ControlledWebviewViewManagerInterface
import com.facebook.react.viewmanagers.ControlledWebviewViewManagerDelegate

@ReactModule(name = ControlledWebviewViewManager.NAME)
class ControlledWebviewViewManager : SimpleViewManager<ControlledWebviewView>(),
  ControlledWebviewViewManagerInterface<ControlledWebviewView> {
  private val mDelegate: ViewManagerDelegate<ControlledWebviewView>

  init {
    mDelegate = ControlledWebviewViewManagerDelegate(this)
  }

  override fun getDelegate(): ViewManagerDelegate<ControlledWebviewView>? {
    return mDelegate
  }

  override fun getName(): String {
    return NAME
  }

  public override fun createViewInstance(context: ThemedReactContext): ControlledWebviewView {
    return ControlledWebviewView(context)
  }

  @ReactProp(name = "color")
  override fun setColor(view: ControlledWebviewView?, color: String?) {
    view?.setBackgroundColor(Color.parseColor(color))
  }

  companion object {
    const val NAME = "ControlledWebviewView"
  }
}
