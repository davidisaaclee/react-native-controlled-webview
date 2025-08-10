import { useRef, useState } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import {
  ControlledWebviewView,
  type ControlledWebviewViewRef,
} from 'react-native-controlled-webview';

export default function App() {
  const [contentOffset, setContentOffset] = useState({ x: 0, y: 0 });
  const webviewRef = useRef<ControlledWebviewViewRef>(null);

  return (
    <View style={styles.container}>
      <ControlledWebviewView
        ref={webviewRef}
        sourceUrl="https://google.com"
        onSourceUrlChange={(event) => {
          console.log('onSourceUrlChange', event.nativeEvent);
        }}
        onContentOffsetChange={(event) => {
          setContentOffset(event.nativeEvent.contentOffset);
          // console.log(
          //   'onContentOffsetChange',
          //   event.nativeEvent.contentOffset.x,
          //   event.nativeEvent.contentOffset.y
          // );
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
        <Text>{`Content Offset: ${contentOffset.x}, ${contentOffset.y}`}</Text>
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
