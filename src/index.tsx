import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Platform } from 'react-native';
import NativeControlledWebviewView, { Commands } from './ControlledWebviewViewNativeComponent';
import type { ViewProps } from 'react-native';
import type {
  DirectEventHandler,
  Double,
} from 'react-native/Libraries/Types/CodegenTypes';

type ContentOffsetChangeEvent = { contentOffset: { x: Double; y: Double } };
type SourceUrlChangeEvent = { sourceUrl: string };
type ZoomScaleChangeEvent = { zoomScale: Double };

export interface ControlledWebviewViewProps extends ViewProps {
  initialSourceUrl?: string;
  onSourceUrlChange?: DirectEventHandler<SourceUrlChangeEvent>;
  onContentOffsetChange?: DirectEventHandler<ContentOffsetChangeEvent>;
  onZoomScaleChange?: DirectEventHandler<ZoomScaleChangeEvent>;
}

export interface ControlledWebviewViewRef {
  setContentOffset: (x: number, y: number, animated?: boolean) => void;
  setSourceUrl: (url: string) => void;
  setZoomScale: (zoomScale: number, animated?: boolean) => void;
}

export const ControlledWebviewView = forwardRef<
  ControlledWebviewViewRef,
  ControlledWebviewViewProps
>((props, ref) => {
  // Platform check - only iOS is supported
  if (Platform.OS !== 'ios') {
    throw new Error(
      `react-native-controlled-webview: Unsupported platform "${Platform.OS}". This package only supports iOS.`
    );
  }

  const nativeRef = useRef<React.ElementRef<typeof NativeControlledWebviewView>>(null);

  useImperativeHandle(ref, () => ({
    setContentOffset: (x: number, y: number, animated = false) => {
      if (nativeRef.current) {
        Commands.setContentOffset(nativeRef.current, x, y, animated);
      }
    },
    setSourceUrl: (url: string) => {
      if (nativeRef.current) {
        Commands.setSourceUrl(nativeRef.current, url);
      }
    },
    setZoomScale: (zoomScale: number, animated = false) => {
      if (nativeRef.current) {
        Commands.setZoomScale(nativeRef.current, zoomScale, animated);
      }
    },
  }));

  return <NativeControlledWebviewView ref={nativeRef} {...props} />;
});

export * from './ControlledWebviewViewNativeComponent';
