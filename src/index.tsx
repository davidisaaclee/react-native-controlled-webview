import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import NativeControlledWebviewView, { Commands } from './ControlledWebviewViewNativeComponent';
import type { ViewProps } from 'react-native';
import type {
  DirectEventHandler,
  Double,
} from 'react-native/Libraries/Types/CodegenTypes';

type ContentOffsetChangeEvent = { contentOffset: { x: Double; y: Double } };
type SourceUrlChangeEvent = { sourceUrl: string };

export interface ControlledWebviewViewProps extends ViewProps {
  initialSourceUrl?: string;
  onSourceUrlChange?: DirectEventHandler<SourceUrlChangeEvent>;
  onContentOffsetChange?: DirectEventHandler<ContentOffsetChangeEvent>;
}

export interface ControlledWebviewViewRef {
  setContentOffset: (x: number, y: number, animated?: boolean) => void;
  setSourceUrl: (url: string) => void;
}

export const ControlledWebviewView = forwardRef<
  ControlledWebviewViewRef,
  ControlledWebviewViewProps
>((props, ref) => {
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
  }));

  return <NativeControlledWebviewView ref={nativeRef} {...props} />;
});

export * from './ControlledWebviewViewNativeComponent';
