import { View, StyleSheet } from 'react-native';
import { ControlledWebviewView } from 'react-native-controlled-webview';

export default function App() {
  return (
    <View style={styles.container}>
      <ControlledWebviewView color="#ff0000" style={styles.box} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
