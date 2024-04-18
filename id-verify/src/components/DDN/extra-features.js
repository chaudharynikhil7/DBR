//to update and use later
import React, { useEffect, useRef, useState } from 'react';
// import "./VideoNormalizer.css";
import { EnumCapturedResultItemType, DSImageData, OriginalImageResultItem, CapturedResultItem, Point } from "dynamsoft-core";
import { CameraEnhancer, CameraView, DrawingItem, ImageEditorView, DrawingStyleManager } from "dynamsoft-camera-enhancer";
import { CapturedResultReceiver, CaptureVisionRouter } from "dynamsoft-capture-vision-router";
import { NormalizedImageResultItem } from "dynamsoft-document-normalizer";

function VideoNormalizer() {
    const imageEditorViewContainerRef = useRef(null);
    const cameraViewContainerRef = useRef(null);
    const normalizedImageContainer = useRef(null);
    const cameraEnhancer = useRef(null);
    const router = useRef(null);
    const [bShowUiContainer, setShowUiContainer] = useState(true);
    const [bShowImageContainer, setShowImageContainer] = useState(false);
    const [bDisabledBtnEdit, setDisabledBtnEdit] = useState(false);
    const [bDisabledBtnNor, setDisabledBtnNor] = useState(true);
    const [bDisabledBtnAutoNor, setDisabledBtnAutoNor] = useState(false);
    const [bShowLoading, setShowLoading] = useState(true);

    const normalizer = useRef(null);
    const dce = useRef(null);
    const imageEditorView = useRef(null);
    const layer = useRef(null);
    const view = useRef(null);
    const items = useRef([]);
    const image = useRef(null);
    let quads = [];

    
    useEffect(() => {
        const init = async () => {
            try {

                //to see the camera and the view
                //imageeditor - for editing purposes otherwise not required
                //layer to draw the quadboxes
                
                view.current = await CameraView.createInstance();
                dce.current = await (cameraEnhancer.current = CameraEnhancer.createInstance(view.current));
                imageEditorView.current = await ImageEditorView.createInstance(imageEditorViewContainerRef.current);
                layer.current = imageEditorView.current.createDrawingLayer();

                normalizer.current = await (router.current = CaptureVisionRouter.createInstance());
                normalizer.current.setInput(dce.current);

                cameraViewContainerRef.current.appendChild(view.current.getUIElement()); 

                //setting resolution
                await dce.current.setResolution({width:960, height:1280});

                //change style for the identifying quad as per your requirement
                let styleWhileDetecting =  {
                    lineWidth: 3,
                    strokeStyle: "yellow"
                    }
                let styleAfterIdentifying =  {
                        lineWidth: 3,
                        strokeStyle: "red"
                        }
                    

                DrawingStyleManager.updateDrawingStyle(1, styleWhileDetecting
               );
               DrawingStyleManager.updateDrawingStyle(5, styleAfterIdentifying
               );

               //tell the sdk to load normalization settings
                let newSettings = await normalizer.current.getSimplifiedSettings("DetectDocumentBoundaries_Default");
                //if you want to use the image, //based on below change the result item will differ in onCapturedResultReceived
                newSettings.capturedResultItemTypes |= EnumCapturedResultItemType.CRIT_ORIGINAL_IMAGE;
                await normalizer.current.updateSettings("DetectDocumentBoundaries_Default", newSettings);

               //defining the result 
                const resultReceiver = new CapturedResultReceiver();

                resultReceiver.onCapturedResultReceived = (result) => {
              //this will give returns on every frame as we are getting image as well in settings otherwise just use onNormalizedResultReceived
                  const originalImage = result.items.filter((item) => item.type === EnumCapturedResultItemType.CRIT_ORIGINAL_IMAGE);
                  if (originalImage.length) {
                    image.current = originalImage[0].imageData;
                  }

                  items.current = result.items.filter((item) => item.type === EnumCapturedResultItemType.CRIT_DETECTED_QUAD);
                  if(items.current){
                    items.current.map(item => {
                      if(item.confidenceAsDocumentBoundary > 70) 
                        console.log("found the quads in the image with confidence over 70", item);
                    })
                    
                  }
                }
                
                normalizer.current.addResultReceiver(resultReceiver);

                await dce.current.open();
                await normalizer.current.startCapturing("DetectDocumentBoundaries_Default");
                setShowLoading(false);
                view.current.setScanLaserVisible(false); //use this to hide the laser

            } catch (ex) {
                let errMsg;
                if (ex.message.includes("network connection error")) {
                    errMsg = "Failed to connect to Dynamsoft License Server: network connection error. Check your Internet connection or contact Dynamsoft Support (support@dynamsoft.com) to acquire an offline license.";
                } else {
                    errMsg = ex.message || ex;
                }
                console.error(errMsg);
                alert(errMsg);
            }
        }
        init();

        return async () => {
            (await router.current)?.dispose();
            (await cameraEnhancer.current)?.dispose();
            console.log('VideoNormalizer Component Unmount');
        }
    }, []);

    const autoNormalize = async () => {






        setDisabledBtnNor(true);
        setDisabledBtnEdit(true);
        normalizer.current.stopCapturing();

    }

    const confirmTheBoundary = () => {
      //this piece of code is to help see image and draw the boundary over the image to manage edit. 
      // if you want to auto normalize, you can skip this part
        if (!dce.current.isOpen() || !items.current.length) return;
        setShowUiContainer(false);
        setShowImageContainer(true);
        imageEditorView.current.setOriginalImage(image.current);
        quads = [];
        for (let i = 0; i < items.current.length; i++) {
            if (items.current[i].type === EnumCapturedResultItemType.CRIT_ORIGINAL_IMAGE) continue;
            const points = items.current[i].location.points;
            const quad = new DrawingItem.QuadDrawingItem({ points });
            quads.push(quad);
            layer.current.addDrawingItems(quads);
        }
        setDisabledBtnEdit(true);
        setDisabledBtnNor(false);
        normalizer.current.stopCapturing();
    }

    const normalize = async () => {
        let seletedItems = imageEditorView.current.getSelectedDrawingItems();
        let quad;
        if (seletedItems.length) {
            quad = seletedItems[0].getQuad();
        } else {
            quad = items.current[0].location;
        }
        const isPointOverBoundary = (point) => {
            if(point.x < 0 || 
            point.x > image.current.width || 
            point.y < 0 ||
            point.y > image.current.height) {
                return true;
            } else {
                return false;
            }
        };
        if (quad.points.some((point) => isPointOverBoundary(point))) {
            alert("The document boundaries extend beyond the boundaries of the image and cannot be used to normalize the document.");
            return;
        }
        setShowImageContainer(false);
        normalizedImageContainer.current.innerHTML = "";
        let newSettings = await normalizer.current.getSimplifiedSettings("normalize-document");
        console.log("second time settings",newSettings)
        newSettings.roiMeasuredInPercentage = false;
        newSettings.roi.points = quad.points;
        await normalizer.current.updateSettings("normalize-document", newSettings);
        let norRes = await normalizer.current.capture(image.current, "normalize-document");
        if (norRes.items[0]) {
            normalizedImageContainer.current.append(norRes.items[0].toCanvas());
        }
        layer.current.clearDrawingItems();
        setDisabledBtnEdit(false);
        setDisabledBtnNor(true);
        setShowUiContainer(true);
        view.current.getUIElement().style.display = "";
        await normalizer.current.startCapturing("DetectDocumentBoundaries_Default");
    }

   
    return (
        <div className="container">
            <div id="div-loading" style={{ display: bShowLoading ? "block" : "none" }}>Loading...</div>
            <div id="div-video-btns">
                <button id="confirm-quad-for-normalization" onClick={confirmTheBoundary} disabled={bDisabledBtnEdit}>Confirm the Boundary</button>
                <button id="normalize-with-confirmed-quad" onClick={normalize} disabled={bDisabledBtnNor}>Normalize</button>
                <button id="startAutoNormalize" onClick={autoNormalize} disabled={bDisabledBtnAutoNor}> Auto - Normalize</button>

            </div >
            <div id="div-ui-container" style={{ display: bShowUiContainer ? "block" : "none", marginTop: "10px", height: "500px" }} ref={cameraViewContainerRef}></div>
            <div id="div-image-container" style={{ display: bShowImageContainer ? "block" : "none", width: "100vw", height: "70vh" }} ref={imageEditorViewContainerRef}>
                <div className="dce-image-container" style={{ width: "100%", height: "100%" }}></div>
            </div>
            <div id="normalized-result" ref={normalizedImageContainer}></div>
        </div >
    );
}

export default VideoNormalizer;
