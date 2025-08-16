import { useRef, useState } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import {
  ControlledWebviewView,
  type ControlledWebviewViewRef,
} from 'react-native-controlled-webview';

export default function App() {
  const [contentOffset, setContentOffset] = useState({ x: 0, y: 0 });
  const [zoomScale, setZoomScale] = useState(1.0);
  const [zoomAnimated, setZoomAnimated] = useState(true);
  const webviewRef = useRef<ControlledWebviewViewRef>(null);

  return (
    <View style={styles.container}>
      <ControlledWebviewView
        ref={webviewRef}
        initialSourceUrl="https://apple.com"
        onSourceUrlChange={(event) => {
          console.log('onSourceUrlChange', event.nativeEvent);
        }}
        onViewportChange={(event) => {
          console.log('Viewport change', event.nativeEvent);
          setContentOffset(event.nativeEvent.contentOffset);
          setZoomScale(event.nativeEvent.zoomScale);
        }}
        style={styles.box}
      />

      <View
        style={{
          position: 'absolute',
          top: 60,
          left: 0,
          right: 0,
          backgroundColor: 'orange',
        }}
      >
        <Button
          title="Jump to top"
          onPress={() => {
            webviewRef.current?.setContentOffset(0, 0, false);
          }}
        />
        <Button
          title="Scroll to top"
          onPress={() => {
            webviewRef.current?.setContentOffset(0, 0, true);
          }}
        />
        <Button
          title="Animate viewport"
          onPress={() => {
            let i = 0;
            const intervalHandle = setInterval(() => {
              if (i > 100) {
                clearInterval(intervalHandle);
                return;
              }

              webviewRef.current?.setViewport(
                {
                  zoomScale: 1.0 + i / 100,
                  contentOffset: { x: i, y: i * 10 },
                },
                true
              );

              i++;
            }, 1);
          }}
        />
        <Text>{`Content Offset: ${contentOffset.x.toFixed(0)}, ${contentOffset.y.toFixed(0)}`}</Text>
        <Text>{`Zoom Scale: ${zoomScale.toFixed(2)}`}</Text>
        <Button
          title={`Zoom Animation: ${zoomAnimated ? 'ON' : 'OFF'}`}
          onPress={() => {
            setZoomAnimated(!zoomAnimated);
          }}
        />
        <Button
          title="Zoom In"
          onPress={() => {
            webviewRef.current?.setZoomScale(zoomScale * 1.5, zoomAnimated);
          }}
        />
        <Button
          title="Zoom Out"
          onPress={() => {
            webviewRef.current?.setZoomScale(zoomScale / 1.5, zoomAnimated);
          }}
        />
        <Button
          title="Reset Zoom"
          onPress={() => {
            webviewRef.current?.setZoomScale(1.0, zoomAnimated);
          }}
        />
        <Button
          title="Google"
          onPress={() => {
            webviewRef.current?.setSourceUrl('https://google.com');
          }}
        />
        <Button
          title="Bing"
          onPress={() => {
            webviewRef.current?.setSourceUrl('https://bing.com');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  box: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'orange',
  },
});
