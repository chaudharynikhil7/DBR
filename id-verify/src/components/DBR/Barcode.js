import { useEffect, useRef, useState } from "react";
import { CameraEnhancer, CameraView } from "dynamsoft-camera-enhancer";
import { DecodedBarcodesResult } from "dynamsoft-barcode-reader";
import {
  CaptureVisionRouter,
  CapturedResultReceiver,
} from "dynamsoft-capture-vision-router";
import { EnumCapturedResultItemType } from "dynamsoft-core";
import { MultiFrameResultCrossFilter } from "dynamsoft-utility";
import "./Barcode.css";
import CanvasRenderer from "./CanvasRenderer";

function Barcode() {
  const uiContainer = useRef(null);
  const resultsContainer = useRef(null);

  const pCameraView = useRef(null);
  const pCameraEnhancer = useRef(null);
  const pRouter = useRef(null);
  
  let [barcodeImage, setBarcodeImage] = useState(null);
  const imageData = {
    width: 200, // Example width of the image
    height: 100, // Example height of the image
    data: new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 255, 255, 0, 255]), // Example pixel data (RGBA format)
  };
  
  
  useEffect(() => {
    const init = async () => {
      // Create a `CameraEnhancer` instance for camera control and a `CameraView` instance for UI control.
      const cameraView = await (pCameraView.current =
        CameraView.createInstance());
      const cameraEnhancer = await (pCameraEnhancer.current =
        CameraEnhancer.createInstance(cameraView));
      uiContainer.current.append(cameraView.getUIElement()); // Get default UI and append it to DOM.

      // Create a `CaptureVisionRouter` instance and set `CameraEnhancer` instance as its image source.
      const router = await (pRouter.current =
        CaptureVisionRouter.createInstance());
      const settings = await router.getSimplifiedSettings("ReadSingleBarcode");
      settings.capturedResultItemTypes |=
        EnumCapturedResultItemType.CRIT_ORIGINAL_IMAGE;
      await router.updateSettings("ReadSingleBarcode", settings);
      console.log("settings updated")
      router.setInput(cameraEnhancer);

      // Define a callback for results.
      const resultReceiver = new CapturedResultReceiver();
      resultReceiver.onCapturedResultReceived = (result) => {
        let barcodes = result.items.filter(
          (item) => item.type === EnumCapturedResultItemType.CRIT_BARCODE
        );
        //work with barcodes
        if (barcodes.length > 0) {
          let imageItems = result.items.filter(
            (item) =>
              item.type === EnumCapturedResultItemType.CRIT_ORIGINAL_IMAGE
          );
          console.log(imageItems[0]); //imageData.toCanvas()
          setBarcodeImage(imageItems[0].imageData)
          
        }
      };

      resultReceiver.onDecodedBarcodesReceived = (result) => {
        if (!result.barcodeResultItems.length) return;

        resultsContainer.current.innerHTML = "";
        console.log(result);
        for (let item of result.barcodeResultItems) {
          resultsContainer.current.innerHTML += `${item.text}<br><hr>`;
        }
      };
      router.addResultReceiver(resultReceiver);

      // Filter out unchecked and duplicate results.
      const filter = new MultiFrameResultCrossFilter();
      filter.enableResultCrossVerification("barcode", true); // Filter out unchecked barcode.
      // Filter out duplicate barcodes within 3 seconds.
      filter.enableResultDeduplication("barcode", true);
      filter.setDuplicateForgetTime("barcode", 3000);
      await router.addResultFilter(filter);

      // Open camera and start scanning barcode.
      await cameraEnhancer.open();
      await router.startCapturing("ReadSingleBarcode");
    };
    init();

    return async () => {
      (await pRouter.current).dispose();
      (await pCameraEnhancer.current).dispose();
      console.log("VideoCapture Component Unmount");
    };
  }, []);

  return (
    <div>
      <div ref={uiContainer} className="div-ui-container"></div>
      Results:
      <br />
      <div ref={resultsContainer} className="div-results-container"></div>
      { barcodeImage ?<CanvasRenderer imageData={barcodeImage}/>: 0}
       {/* <CanvasRenderer imageData={imageData} /> */}
    </div>
  );
}

export default Barcode;
