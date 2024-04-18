import React from 'react';

const CanvasRenderer = ({ imageData }) => {
  return <canvas ref={(canvas) => {
    if (canvas && imageData) {
      imageData.toCanvas(canvas);
    }
  }} />;
};

export default CanvasRenderer;
