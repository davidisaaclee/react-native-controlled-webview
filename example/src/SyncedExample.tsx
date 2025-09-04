import { useRef } from 'react';
import { SafeAreaView, View } from 'react-native';

import {
  ControlledWebviewView,
  type ControlledWebviewViewRef,
} from 'react-native-controlled-webview';

const LATENCY_MS = 10;

export default function App() {
  const followRef = useRef<ControlledWebviewViewRef>(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'orange' }}>
      <ControlledWebviewView
        style={{ flex: 1 }}
        initialSourceUrl="https://apple.com"
        onSourceUrlChange={(event) => {
          const sourceUrl = event.nativeEvent.sourceUrl;
          setTimeout(() => {
            followRef.current?.setSourceUrl(sourceUrl);
          }, LATENCY_MS);
        }}
        onViewportChange={(event) => {
          const viewport = event.nativeEvent;
          setTimeout(() => {
            followRef.current?.setViewport(viewport);
          }, LATENCY_MS);
        }}
      />
      <ControlledWebviewView
        ref={followRef}
        style={{ flex: 1 }}
        initialSourceUrl="https://apple.com"
      />
    </SafeAreaView>
  );
}
