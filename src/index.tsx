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
  sourceUrl?: string;
  onSourceUrlChange?: DirectEventHandler<SourceUrlChangeEvent>;
  onContentOffsetChange?: DirectEventHandler<ContentOffsetChangeEvent>;
}

export interface ControlledWebviewViewRef {
  setContentOffset: (x: number, y: number, animated?: boolean) => void;
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
  }));

  return <NativeControlledWebviewView ref={nativeRef} {...props} />;
});

export * from './ControlledWebviewViewNativeComponent';
