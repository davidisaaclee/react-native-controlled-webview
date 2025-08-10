import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type {
  DirectEventHandler,
  Double,
} from 'react-native/Libraries/Types/CodegenTypes';
import type { ViewProps } from 'react-native';

type ContentOffsetChangeEvent = { contentOffset: { x: Double; y: Double } };
type SourceUrlChangeEvent = { sourceUrl: string };

interface NativeProps extends ViewProps {
  sourceUrl?: string;
  onSourceUrlChange?: DirectEventHandler<SourceUrlChangeEvent>;

  contentOffset?: { x: Double; y: Double };
  onContentOffsetChange?: DirectEventHandler<ContentOffsetChangeEvent>;
}

export default codegenNativeComponent<NativeProps>('ControlledWebviewView');
