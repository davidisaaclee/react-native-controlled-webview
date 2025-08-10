import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import type {
  DirectEventHandler,
  Double,
} from 'react-native/Libraries/Types/CodegenTypes';
import type { HostComponent, ViewProps } from 'react-native';

type ContentOffsetChangeEvent = { contentOffset: { x: Double; y: Double } };
type SourceUrlChangeEvent = { sourceUrl: string };

export interface NativeProps extends ViewProps {
  initialSourceUrl?: string;
  onSourceUrlChange?: DirectEventHandler<SourceUrlChangeEvent>;
  onContentOffsetChange?: DirectEventHandler<ContentOffsetChangeEvent>;
}

interface NativeCommands {
  setContentOffset: (
    viewRef: React.ElementRef<HostComponent<NativeProps>>,
    x: Double,
    y: Double,
    animated?: boolean
  ) => void;
  setSourceUrl: (
    viewRef: React.ElementRef<HostComponent<NativeProps>>,
    url: string
  ) => void;
}

export const Commands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['setContentOffset', 'setSourceUrl'],
});

export default codegenNativeComponent<NativeProps>(
  'ControlledWebviewView'
) as HostComponent<NativeProps>;
