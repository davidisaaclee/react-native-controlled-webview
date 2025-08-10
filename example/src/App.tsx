import { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { ControlledWebviewView } from 'react-native-controlled-webview';

export default function App() {
  const [contentOffset, setContentOffset] = useState({ x: 0, y: 0 });

  return (
    <View style={styles.container}>
      <ControlledWebviewView
        sourceUrl="https://google.com"
        onSourceUrlChange={(event) => {
          console.log('onSourceUrlChange', event.nativeEvent);
        }}
        contentOffset={contentOffset}
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
          title="0,0"
          onPress={() => {
            setContentOffset({ x: 0, y: 0 });
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
