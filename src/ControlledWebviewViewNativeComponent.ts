import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import type {
  DirectEventHandler,
  Double,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';
import type { HostComponent, ViewProps } from 'react-native';

type SourceUrlChangeEvent = { sourceUrl: string };
type ViewportChangeEvent = {
  zoomScale: Double;
  contentOffset: { x: Double; y: Double };
};
type ScriptMessageEvent = { name: string; body: string };

export interface NativeProps extends ViewProps {
  initialSourceUrl?: string;
  onSourceUrlChange?: DirectEventHandler<SourceUrlChangeEvent>;
  onViewportChange?: DirectEventHandler<ViewportChangeEvent>;
  onScriptMessage?: DirectEventHandler<ScriptMessageEvent>;
}

export const WKUserScriptInjectionTimeAtDocumentStart = 0;
export const WKUserScriptInjectionTimeAtDocumentEnd = 1;

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
  addUserScript: (
    viewRef: React.ElementRef<HostComponent<NativeProps>>,
    source: string,
    injectionTime: Int32, // see WKUserScriptInjectionTime* constants above
    forMainFrameOnly: boolean
  ) => void;
  addMessageHandler: (
    viewRef: React.ElementRef<HostComponent<NativeProps>>,
    name: string
  ) => void;
}

export const Commands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['setViewport', 'setSourceUrl', 'addUserScript', 'addMessageHandler'],
});

export default codegenNativeComponent<NativeProps>(
  'ControlledWebviewView'
) as HostComponent<NativeProps>;
