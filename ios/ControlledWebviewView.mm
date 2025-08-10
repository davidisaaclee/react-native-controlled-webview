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
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<ControlledWebviewViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const ControlledWebviewViewProps>();
    _props = defaultProps;

    _webView = [WKWebView new];
    _webView.navigationDelegate = self;
    _webView.scrollView.delegate = self;

    self.contentView = _webView;
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<ControlledWebviewViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<ControlledWebviewViewProps const>(props);

  if (oldViewProps.sourceUrl != newViewProps.sourceUrl) {
    NSString *urlString = [NSString stringWithCString:newViewProps.sourceUrl.c_str() encoding:NSUTF8StringEncoding];
    _sourceURL = [NSURL URLWithString:urlString];
    if (_sourceURL && _sourceURL.scheme && _sourceURL.host) {
      [_webView loadRequest:[NSURLRequest requestWithURL:_sourceURL]];
    }
  }
  
  if (
      oldViewProps.contentOffset.x != newViewProps.contentOffset.x
      || oldViewProps.contentOffset.y != newViewProps.contentOffset.y
    ) {
      if (_webView.scrollView.contentOffset.x != newViewProps.contentOffset.x || _webView.scrollView.contentOffset.y != newViewProps.contentOffset.y) {
        _webView.scrollView.contentOffset = CGPointMake(newViewProps.contentOffset.x, newViewProps.contentOffset.y);
      }
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
  
  ControlledWebviewViewEventEmitter::OnContentOffsetChange result = ControlledWebviewViewEventEmitter::OnContentOffsetChange();
  result.contentOffset.x = scrollView.contentOffset.x;
  result.contentOffset.y = scrollView.contentOffset.y;
  self.eventEmitter.onContentOffsetChange(result);
}

- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation
{
}

- (const ControlledWebviewViewEventEmitter &)eventEmitter
{
  return static_cast<const ControlledWebviewViewEventEmitter &>(*_eventEmitter);
}

Class<RCTComponentViewProtocol> ControlledWebviewViewCls(void)
{
    return ControlledWebviewView.class;
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
