# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- `yarn typecheck` - Run TypeScript type checking
- `yarn lint` - Run ESLint on all TypeScript/JavaScript files
- `yarn lint --fix` - Auto-fix ESLint issues
- `yarn test` - Run Jest unit tests
- `yarn example start` - Start Metro server for example app
- `yarn example android` - Run example app on Android
- `yarn example ios` - Run example app on iOS
- `yarn clean` - Clean build directories and lib folder
- `yarn prepare` - Build the library using react-native-builder-bob
- `yarn release` - Publish new version using release-it

## Architecture

This is an **iOS-only** React Native library created with create-react-native-library that provides a controlled WebView component. The library uses React Native's new Fabric/TurboModules architecture and does not support Android or web platforms.

### Key Components:

- **Native Component Interface** (`src/ControlledWebviewViewNativeComponent.ts`): Defines the TypeScript interface for the native component with props for `sourceUrl`, `contentOffset`, and event handlers
- **iOS Implementation** (`ios/ControlledWebviewView.mm`): Objective-C++ implementation using WKWebView with scroll position control and event emission
- **Android Implementation**: ❌ Not supported - package is iOS-only
- **JavaScript Entry Point** (`src/index.tsx`): Exports the native component

### Core Functionality:

The library provides a WebView that allows:
- Setting and controlling content offset/scroll position via props
- Receiving scroll events via onContentOffsetChange callback
- Loading URLs via sourceUrl prop
- URL change notifications via onSourceUrlChange callback

### Build System:

- Uses `react-native-builder-bob` for library compilation
- Outputs to `lib/` directory with both module and TypeScript declaration files
- Supports both old and new React Native architectures
- Uses Turbo for build caching with iOS-only pipeline
- Includes platform check that throws error on non-iOS platforms

### Development Workflow:

The project uses a monorepo structure with an example app in `example/` directory for testing. Changes to library source are automatically reflected in the example app for JavaScript changes, but native changes require rebuilding the example app.

### Quality Assurance:

- ESLint with Prettier for code formatting
- TypeScript for type checking with strict configuration
- Jest for testing
- Conventional commits for commit message format