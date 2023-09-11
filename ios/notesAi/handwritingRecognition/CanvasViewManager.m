#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import <PencilKit/PencilKit.h> // Import the PencilKit library
#import <Vision/Vision.h>





@interface CanvasView : UIView <PKCanvasViewDelegate, PKToolPickerObserver>
@property (nonatomic, strong) PKCanvasView *canvasView;
@property (nonatomic, strong) PKToolPicker *toolPicker;
@property (nonatomic, copy) RCTBubblingEventBlock onRecognizeText;
@property (nonatomic, copy) RCTBubblingEventBlock onDrawingChange;
@end

@implementation CanvasView
@synthesize onRecognizeText = _onRecognizeText;

- (instancetype)init {
    self = [super init];
    if (self) {
        if (@available(iOS 14.0, *)) {

            _canvasView = [[PKCanvasView alloc] init];
            // _canvasView.backgroundColor = UIColor.blackColor;
            // _canvasView.drawingPolicy = PKCanvasViewDrawingPolicyPencilOnly;
            _canvasView.delegate = self;
            _canvasView.opaque = NO;
            _canvasView.backgroundColor = [UIColor clearColor];

            // Set the default tool as a black ink pen
            PKInkingTool *blackInkPen = [[PKInkingTool alloc] initWithInkType:PKInkTypePen color:[UIColor blackColor]];
            _canvasView.tool = blackInkPen;
            
            [self addSubview:_canvasView]; // Add the canvas on top of the lines

        }
    }
    return self;
}

- (void)didMoveToWindow {
    [super didMoveToWindow];
    
    if (@available(iOS 14.0, *)) {
        self.toolPicker = [PKToolPicker sharedToolPickerForWindow:self.window];
        [self.toolPicker addObserver:self]; // Add self as an observer
        [self.toolPicker setVisible:YES forFirstResponder:self.canvasView];
        [self.canvasView becomeFirstResponder];
    }
}

// Don't forget to handle layout appropriately, you may wish to update this code as per your requirement
- (void)layoutSubviews {
    [super layoutSubviews];
    self.canvasView.frame = self.bounds;
    [self setNeedsDisplay]; // Redraw the lines
}

- (void)toolPickerSelectedToolDidChange:(PKToolPicker *)toolPicker {
    if (@available(iOS 14.0, *)) {
        self.canvasView.tool = toolPicker.selectedTool;
        [self.canvasView setNeedsDisplay];
        NSLog(@"Tool changed to: %@", toolPicker.selectedTool);
    }
}

- (UIImage *)captureCanvasDrawing {
    if (@available(iOS 14.0, *)) {
        PKDrawing *drawing = self.canvasView.drawing;
        CGRect bounds = CGRectMake(0, 0, self.canvasView.bounds.size.width, self.canvasView.bounds.size.height);
        UIImage *image = [drawing imageFromRect:bounds scale:self.canvasView.contentScaleFactor];
        return image;
    }
    return nil;
}

- (PKDrawing *)drawingFromBase64:(NSString *)base64String {
    if (@available(iOS 14.0, *)) {
        NSData *data = [[NSData alloc] initWithBase64EncodedString:base64String options:NSDataBase64DecodingIgnoreUnknownCharacters];
        NSError *error;
        PKDrawing *drawing = [[PKDrawing alloc] initWithData:data error:&error];
        
        if (error) {
            NSLog(@"Failed to convert Base64 to PKDrawing: %@", error);
            return nil;
        }
        
        return drawing;
    } else {
        // Handle older iOS versions, if necessary
        NSLog(@"PKDrawing is not available in this iOS version");
        return nil;
    }
}


- (void)setCanvasDrawingFromBase64:(NSString *)base64String {
    PKDrawing *drawing = [self drawingFromBase64:base64String];
    if (drawing) {
        _canvasView.drawing = drawing;
    }
}



- (void)recognizeTextFromImage:(UIImage *)image completion:(void (^)(NSString *recognizedText, NSError *error))completion {
    VNRecognizeTextRequest *textRequest = [[VNRecognizeTextRequest alloc] initWithCompletionHandler:^(VNRequest * _Nonnull request, NSError * _Nullable error) {
        NSMutableString *resultText = [NSMutableString new];
        for (VNRecognizedTextObservation *observation in request.results) {
            VNRecognizedText *recognizedText = [observation topCandidates:1].firstObject;
            if (recognizedText) {
                [resultText appendString:recognizedText.string];
                [resultText appendString:@"\n"];
            }
        }
        completion(resultText, error);
    }];
    textRequest.recognitionLevel = VNRequestTrackingLevelAccurate;
    CGImageRef cgImage = image.CGImage;
    VNImageRequestHandler *handler = [[VNImageRequestHandler alloc] initWithCGImage:cgImage options:@{}];
    NSError *error = nil;
    [handler performRequests:@[textRequest] error:&error];
    if (error) {
        completion(nil, error);
    }
}

- (void)setOnRecognizeText:(RCTBubblingEventBlock)onRecognizeText
{
  _onRecognizeText = [onRecognizeText copy];
}

- (void)canvasViewDrawingDidChange:(PKCanvasView *)canvasView {
    if (self.onDrawingChange) {
        self.onDrawingChange(@{}); // Call the JS event when the drawing changes
    }
}

- (void)setOnDrawingChange:(RCTBubblingEventBlock)onDrawingChange {
    _onDrawingChange = [onDrawingChange copy];
}

// - (void)drawRect:(CGRect)rect {
//     CGContextRef context = UIGraphicsGetCurrentContext();
//     CGContextSetStrokeColorWithColor(context, [UIColor whiteColor].CGColor); // Set the line color
//     CGContextSetLineWidth(context, 1.0); // Set the line width

//     CGFloat lineSpacing = 100.0; // Spacing between lines
//     CGFloat yPos = 0;

//     while (yPos < self.bounds.size.height) {
//         CGContextMoveToPoint(context, 0, yPos);
//         CGContextAddLineToPoint(context, self.bounds.size.width, yPos);
//         yPos += lineSpacing;
//     }

//     CGContextStrokePath(context);
// }

@end


@interface CanvasViewManager : RCTViewManager
@end

@implementation CanvasViewManager

RCT_EXPORT_MODULE(CanvasView)

RCT_EXPORT_VIEW_PROPERTY(onRecognizeText, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDrawingChange, RCTBubblingEventBlock)

- (NSArray<NSString *> *)customDirectEventTypes {
  return @[@"onRecognizeText", @"onDrawingChange"];
}


RCT_EXPORT_METHOD(recognizeText:(nonnull NSNumber *)reactTag)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, CanvasView *> *viewRegistry) {
        CanvasView *view = viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[CanvasView class]]) {
            RCTLogError(@"Cannot find CanvasView with tag #%@", reactTag);
            return;
        }

        UIImage *image = [view captureCanvasDrawing];
        [view recognizeTextFromImage:image completion:^(NSString *recognizedText, NSError *error) {
            if (recognizedText) {
                if (view.onRecognizeText) {
                    view.onRecognizeText(@{@"recognizedText": recognizedText});
                }
            }
        }];
    }];
}


RCT_EXPORT_METHOD(captureDrawing:(nonnull NSNumber *)reactTag
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
    CanvasView *view = (CanvasView *)viewRegistry[reactTag];
    if (!view || ![view isKindOfClass:[CanvasView class]]) {
      reject(@"INVALID_VIEW", @"View not found", nil);
      return;
    }

    // Capture the drawing as an image
    UIImage *image = [view captureCanvasDrawing];

    // Convert the image to a Base64 string
    // float compressionQuality = 0.1;  // Adjust this value based on your requirements
    // NSData *imageData = UIImageJPEGRepresentation(image, compressionQuality);
    // NSData *imageData = UIImagePNGRepresentation(image);
    // NSString *base64String = [imageData base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];

    NSData *drawingData = view.canvasView.drawing.dataRepresentation;
    NSString *base64String = [drawingData base64EncodedStringWithOptions:0];

    // // Resolve the promise with the Base64 string
    resolve(base64String);
  }];
}

RCT_EXPORT_METHOD(setDrawingFromBase64:(nonnull NSNumber *)reactTag base64String:(NSString *)base64String) {
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, CanvasView *> *viewRegistry) {
        CanvasView *view = viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[CanvasView class]]) {
            RCTLogError(@"Cannot find CanvasView with tag #%@", reactTag);
            return;
        }
        
        [view setCanvasDrawingFromBase64:base64String];
    }];
}


- (UIView *)view
{
    if (@available(iOS 14.0, *)) {
        // return [[PKCanvasView alloc] init];

        return [[CanvasView alloc] init];;
    } else {
        // Return a fallback view for older iOS versions, or nil if not applicable
        return nil;
    }
}

@end
