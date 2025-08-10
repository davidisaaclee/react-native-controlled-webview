import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type {
  DirectEventHandler,
  Double,
} from 'react-native/Libraries/Types/CodegenTypes';
import type { ViewProps } from 'react-native';

// type Vector2D = { x: number; y: number };

type ContentOffsetChangeEvent = { contentOffset: { x: Double; y: Double } };

interface NativeProps extends ViewProps {
  color?: string;
  sourceUrl?: string;
  contentOffset?: { x: Double; y: Double };
  onContentOffsetChange?: DirectEventHandler<ContentOffsetChangeEvent>;
}

export default codegenNativeComponent<NativeProps>('ControlledWebviewView');
