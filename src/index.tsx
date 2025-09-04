import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Platform } from 'react-native';
import NativeControlledWebviewView, {
  Commands,
} from './ControlledWebviewViewNativeComponent';
import type { ViewProps } from 'react-native';
import type {
  DirectEventHandler,
  Double,
} from 'react-native/Libraries/Types/CodegenTypes';

type SourceUrlChangeEvent = { sourceUrl: string };
type ViewportChangeEvent = {
  contentOffset: { x: Double; y: Double };
  zoomScale: Double;
};
type ScriptMessageEvent = { name: string; body: unknown };

export interface ControlledWebviewViewProps extends ViewProps {
  initialSourceUrl?: string;
  onSourceUrlChange?: DirectEventHandler<SourceUrlChangeEvent>;
  onViewportChange?: DirectEventHandler<ViewportChangeEvent>;
}

export interface ControlledWebviewViewRef {
  setContentOffset: (x: number, y: number, animated?: boolean) => void;
  setSourceUrl: (url: string) => void;
  setViewport: (
    viewport: { zoomScale: number; contentOffset: { x: number; y: number } },
    animated?: boolean
  ) => void;
  setZoomScale: (zoomScale: number, animated?: boolean) => void;
  addUserScript: (
    source: string,
    injectionTime: number,
    forMainFrameOnly: boolean
  ) => void;
  addMessageHandler: (name: string, handler: (body: unknown) => void) => void;
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

  const nativeRef =
    useRef<React.ElementRef<typeof NativeControlledWebviewView>>(null);
  const messageHandlers = useRef<Map<string, (body: unknown) => void>>(
    new Map()
  );

  useImperativeHandle(ref, () => ({
    setContentOffset: (x: number, y: number, animated = false) => {
      if (nativeRef.current) {
        Commands.setViewport(nativeRef.current, x, y, undefined, animated);
      }
    },
    setSourceUrl: (url: string) => {
      if (nativeRef.current) {
        Commands.setSourceUrl(nativeRef.current, url);
      }
    },
    setViewport(viewport, animated = false) {
      if (nativeRef.current) {
        Commands.setViewport(
          nativeRef.current,
          viewport.contentOffset.x,
          viewport.contentOffset.y,
          viewport.zoomScale,
          animated
        );
      }
    },
    setZoomScale: (zoomScale: number, animated = false) => {
      if (nativeRef.current) {
        Commands.setViewport(
          nativeRef.current,
          undefined,
          undefined,
          zoomScale,
          animated
        );
      }
    },
    addUserScript: (
      source: string,
      injectionTime: number,
      forMainFrameOnly: boolean
    ) => {
      if (nativeRef.current) {
        Commands.addUserScript(
          nativeRef.current,
          source,
          injectionTime,
          forMainFrameOnly
        );
      }
    },
    addMessageHandler: (name: string, handler: (body: unknown) => void) => {
      messageHandlers.current.set(name, handler);
      if (nativeRef.current) {
        Commands.addMessageHandler(nativeRef.current, name);
      }
    },
  }));

  return (
    <NativeControlledWebviewView
      ref={nativeRef}
      {...props}
      onScriptMessage={(event) => {
        const { name, body } = event.nativeEvent;
        const handler = messageHandlers.current.get(name);
        if (handler) {
          let parsedBody;
          try {
            parsedBody = JSON.parse(body);
          } catch {
            parsedBody = body;
          }
          handler(parsedBody);
        }
      }}
    />
  );
});

export * from './ControlledWebviewViewNativeComponent';
