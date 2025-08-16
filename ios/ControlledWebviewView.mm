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

    _webView = [WKWebView new];
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
    if ([commandName isEqualToString:@"setViewport"]) {
        if (args.count >= 4) {
            CGFloat x = (args[0] == nil || [args[0] isKindOfClass:[NSNull class]]) ? NAN : [args[0] doubleValue];
            CGFloat y = (args[1] == nil || [args[1] isKindOfClass:[NSNull class]]) ? NAN : [args[1] doubleValue];
            CGFloat zoomScale = (args[2] == nil || [args[2] isKindOfClass:[NSNull class]]) ? NAN : [args[2] doubleValue];
            BOOL animated = (args[3] == nil || [args[3] isKindOfClass:[NSNull class]]) ? NO : [args[3] boolValue];

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
                [_webView.scrollView setZoomScale:zoomScale animated:animated];
            }
        }
    } else if ([commandName isEqualToString:@"setSourceUrl"]) {
        if (args.count >= 1) {
            NSString *urlString = args[0];
            if ([urlString isKindOfClass:[NSString class]]) {
                _sourceURL = [NSURL URLWithString:urlString];
                if (_sourceURL && _sourceURL.scheme && _sourceURL.host) {
                    [_webView loadRequest:[NSURLRequest requestWithURL:_sourceURL]];
                }
            }
        }
    }
}

- (void)dealloc
{
  [_webView removeObserver:self forKeyPath:@"URL"];
}

- (const ControlledWebviewViewEventEmitter &)eventEmitter
{
  return static_cast<const ControlledWebviewViewEventEmitter &>(*_eventEmitter);
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
