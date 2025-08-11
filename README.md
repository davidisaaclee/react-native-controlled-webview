# react-native-controlled-webview

**iOS-only** web view with methods to control content offset and zoom scale

> ⚠️ **Platform Support**: This package only supports iOS. Android and web platforms are not supported.

## Installation

```sh
npm install react-native-controlled-webview
```

**iOS Setup:**
```sh
cd ios && pod install
```

## Platform Requirements

- **iOS**: iOS 11.0+
- **React Native**: 0.60+
- **Android**: ❌ Not supported
- **Web**: ❌ Not supported

## Usage

```js
import { ControlledWebviewView } from "react-native-controlled-webview";

// ...

<ControlledWebviewView
  initialSourceUrl="https://example.com"
  onContentOffsetChange={(event) => {
    console.log('Content offset:', event.nativeEvent.contentOffset);
  }}
  onZoomScaleChange={(event) => {
    console.log('Zoom scale:', event.nativeEvent.zoomScale);
  }}
/>
```


## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
