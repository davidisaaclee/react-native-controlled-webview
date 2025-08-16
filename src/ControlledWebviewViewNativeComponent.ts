import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import type {
  DirectEventHandler,
  Double,
} from 'react-native/Libraries/Types/CodegenTypes';
import type { HostComponent, ViewProps } from 'react-native';

type SourceUrlChangeEvent = { sourceUrl: string };
type ViewportChangeEvent = {
  zoomScale: Double;
  contentOffset: { x: Double; y: Double };
};

export interface NativeProps extends ViewProps {
  initialSourceUrl?: string;
  onSourceUrlChange?: DirectEventHandler<SourceUrlChangeEvent>;
  onViewportChange?: DirectEventHandler<ViewportChangeEvent>;
}

interface NativeCommands {
  setViewport: (
    viewRef: React.ElementRef<HostComponent<NativeProps>>,
    contentOffsetX?: Double,
    contentOffsetY?: Double,
    zoomScale?: Double,
    animated?: boolean
  ) => void;
  setSourceUrl: (
    viewRef: React.ElementRef<HostComponent<NativeProps>>,
    url: string
  ) => void;
}

export const Commands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['setViewport', 'setSourceUrl'],
});

export default codegenNativeComponent<NativeProps>(
  'ControlledWebviewView'
) as HostComponent<NativeProps>;
