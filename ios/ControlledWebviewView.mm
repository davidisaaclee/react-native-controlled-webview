#import "ControlledWebviewView.h"

#import <react/renderer/components/ControlledWebviewViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/ControlledWebviewViewSpec/EventEmitters.h>
#import <react/renderer/components/ControlledWebviewViewSpec/Props.h>
#import <react/renderer/components/ControlledWebviewViewSpec/RCTComponentViewHelpers.h>
#import <WebKit/WebKit.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface ControlledWebviewView () <RCTControlledWebviewViewViewProtocol, WKNavigationDelegate, UIScrollViewDelegate>

@end

@implementation ControlledWebviewView {
    NSURL * _sourceURL;
    WKWebView * _webView;
    WKUserContentController *_wkContentController;
    BOOL _hasLoadedInitialURL;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<ControlledWebviewViewComponentDescriptor>();
}

Class<RCTComponentViewProtocol> ControlledWebviewViewCls(void)
{
    return ControlledWebviewView.class;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const ControlledWebviewViewProps>();
    _props = defaultProps;

    _wkContentController = [[WKUserContentController alloc] init];

    WKWebViewConfiguration *wkConfiguration = [[WKWebViewConfiguration alloc] init];
    [wkConfiguration setUserContentController:_wkContentController];

    _webView = [[WKWebView alloc] initWithFrame:frame configuration:wkConfiguration];
    _webView.navigationDelegate = self;
    _webView.scrollView.delegate = self;
    _hasLoadedInitialURL = NO;

    // Add KVO for URL changes
    [_webView addObserver:self forKeyPath:@"URL" options:NSKeyValueObservingOptionNew context:nil];

    self.contentView = _webView;
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<ControlledWebviewViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<ControlledWebviewViewProps const>(props);

  // Only load initial URL on first render
  if (!_hasLoadedInitialURL && !newViewProps.initialSourceUrl.empty()) {
    NSString *urlString = [NSString stringWithCString:newViewProps.initialSourceUrl.c_str() encoding:NSUTF8StringEncoding];
    _sourceURL = [NSURL URLWithString:urlString];
    if (_sourceURL && _sourceURL.scheme && _sourceURL.host) {
      [_webView loadRequest:[NSURLRequest requestWithURL:_sourceURL]];
      _hasLoadedInitialURL = YES;
    }
  }


  [super updateProps:props oldProps:oldProps];
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
  ControlledWebviewViewEventEmitter::OnViewportChange result = ControlledWebviewViewEventEmitter::OnViewportChange();
  result.contentOffset.x = scrollView.contentOffset.x;
  result.contentOffset.y = scrollView.contentOffset.y;
  result.zoomScale = scrollView.zoomScale;
  self.eventEmitter.onViewportChange(result);
}

- (void)scrollViewDidZoom:(UIScrollView *)scrollView
{
  ControlledWebviewViewEventEmitter::OnViewportChange result = ControlledWebviewViewEventEmitter::OnViewportChange();
  result.contentOffset.x = scrollView.contentOffset.x;
  result.contentOffset.y = scrollView.contentOffset.y;
  result.zoomScale = scrollView.zoomScale;
  self.eventEmitter.onViewportChange(result);
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSKeyValueChangeKey,id> *)change context:(void *)context
{
    if ([keyPath isEqualToString:@"URL"] && object == _webView) {
        NSURL *newURL = change[NSKeyValueChangeNewKey];
        if (newURL && ![newURL isEqual:[NSNull null]] && _eventEmitter) {
            dispatch_async(dispatch_get_main_queue(), ^{
                if (self->_eventEmitter) {
                    ControlledWebviewViewEventEmitter::OnSourceUrlChange result = ControlledWebviewViewEventEmitter::OnSourceUrlChange();
                    result.sourceUrl = std::string([newURL.absoluteString UTF8String]);
                    self.eventEmitter.onSourceUrlChange(result);
                }
            });
        }
    } else {
        [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
    }
}

- (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args
{
  RCTControlledWebviewViewHandleCommand(self, commandName, args);
}

- (void)dealloc
{
  [_webView removeObserver:self forKeyPath:@"URL"];
}

- (const ControlledWebviewViewEventEmitter &)eventEmitter
{
  return static_cast<const ControlledWebviewViewEventEmitter &>(*_eventEmitter);
}

- (void)setViewport:(double)contentOffsetX
     contentOffsetY:(double)contentOffsetY
          zoomScale:(double)zoomScale
           animated:(BOOL)animated
{
  CGFloat x = contentOffsetX;
  CGFloat y = contentOffsetY;

  if (!isnan(x) || !isnan(y)) {
      CGPoint contentOffset = _webView.scrollView.contentOffset;
      if (!isnan(x)) {
          contentOffset.x = x;
      }
      if (!isnan(y)) {
          contentOffset.y = y;
      }
      [_webView.scrollView setContentOffset:contentOffset animated:animated];
  }
  if (!isnan(zoomScale)) {
    if (zoomScale > [_webView.scrollView maximumZoomScale]) {
      [_webView.scrollView setMaximumZoomScale:zoomScale];
    }
    if (zoomScale < [_webView.scrollView minimumZoomScale]) {
      [_webView.scrollView setMinimumZoomScale:zoomScale];
    }

    [_webView.scrollView setZoomScale:zoomScale animated:animated];
  }
}

- (void)setSourceUrl:(NSString *)url
{
  _sourceURL = [NSURL URLWithString:url];
  if (_sourceURL && _sourceURL.scheme && _sourceURL.host) {
    [_webView loadRequest:[NSURLRequest requestWithURL:_sourceURL]];
  }
}

- (void)addUserScript:(NSString *)source
        injectionTime:(NSInteger)injectionTime
     forMainFrameOnly:(BOOL)forMainFrameOnly
{
  WKUserScript *script = [[WKUserScript alloc] initWithSource:source
                                                injectionTime:(WKUserScriptInjectionTime)injectionTime
                                             forMainFrameOnly:forMainFrameOnly];
  [_wkContentController addUserScript:script];
}

- hexStringToColor:(NSString *)stringToConvert
{
  NSString *noHashString = [stringToConvert stringByReplacingOccurrencesOfString:@"#" withString:@""];
  NSScanner *stringScanner = [NSScanner scannerWithString:noHashString];

  unsigned hex;
  if (![stringScanner scanHexInt:&hex]) return nil;
  int r = (hex >> 16) & 0xFF;
  int g = (hex >> 8) & 0xFF;
  int b = (hex) & 0xFF;

  return [UIColor colorWithRed:r / 255.0f green:g / 255.0f blue:b / 255.0f alpha:1.0f];
}

@end
