"use client";

import { useRef, useState, useEffect } from "react";
import { useCanvasContext } from "@/context/CanvasContext";
import Canvas from "./canvas";

type Point = { x: number; y: number };

interface BoundingBox {
  leftTop: Point;
  rightBottom: Point;
}

const ImageAnnotation: React.FC = () => {
  const {
    ctx,
    setCtx,
    undoStack,
    setUndoStack,
    imgRef,
    canvasRef,
    canvasDimensions,
    setCanvasDimensions,
    boxes,
    setBoxes,
  } = useCanvasContext();

  const [rotationAngle, setRotationAngle] = useState<number>(90);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      setCtx(context);
    }
  }, []);

  const clearAnnotations = () => {
    if (ctx && canvasRef.current && imgRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(imgRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleBoundingBoxDrawing = () => {
    if (ctx && canvasRef.current && imgRef.current) {
        const fetchBoundingBoxes = async () => {
        const response = await fetch("/api/boundingbox");
        const data: BoundingBox[] = await response.json();
        setBoxes(data);
      };
      fetchBoundingBoxes();
    }
  };

  const undoLast = () => {
    if (ctx && undoStack.length > 0) {
      const previousState = undoStack.pop();
      setUndoStack([...undoStack]); 
      if (previousState) {
        ctx.putImageData(previousState, 0, 0);
      }
    }
  };

  const rotateImage = () => {
    setRotationAngle((prevAngle) => (prevAngle - 90) % 360);

    console.log('rotationAngle', rotationAngle);

    const radians = rotationAngle * Math.PI / 180;
    const canvas = canvasRef?.current;
    const image = imgRef?.current;

    if(ctx && canvas && image) {
      const canvasWidth = canvas.width;
      const canvasAspectRatio = canvasWidth / canvas.height;
      const canvasHeight = canvasWidth * canvasAspectRatio;

      ctx.save();
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // setCanvasDimensions({ height: canvasHeight, width: canvasWidth });

      // canvas.height = canvasHeight;
      // canvas.width = canvasWidth;

      ctx.translate(canvasWidth / 2, canvas.height / 2);
      ctx.rotate(radians);
      ctx.translate(-canvasWidth / 2, -canvas.height / 2);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(image, 0, 0, canvasWidth, canvasWidth/canvasAspectRatio);
      ctx.restore();
    }
  };
  
  

  return (
    <div className="p-4 text-black flex flex-col gap-6 w-full h-full">
      <h1 className="text-2xl">Image Annotation</h1>
      <input
        id="fileInput"
        type="file"
        onChange={(e) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (imgRef.current) {
              imgRef.current.src = event.target?.result as string;
            }
          };
          if (e.target.files?.[0]) {
            reader.readAsDataURL(e.target.files[0]);
          }
        }}
      />



      <div className="flex gap-6">
        {/* <div className="flex gap-2 align-items-center justify-center">
          <input type="checkbox" id="forceAspectRatio" name="forceAspectRatio" value="forceAspectRatio" />
          <label htmlFor="forceAspectRatio">Force 1x1 Aspect Ratio</label>
        </div> */}

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={rotateImage}
        >
          Rotate Image
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={clearAnnotations}
        >
          Clear Annotations
        </button>
        {/* draw bounding box */}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleBoundingBoxDrawing}
        >
          Draw Bounding Box
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={undoLast}
        >
          Step Back
        </button>
      </div>

      <Canvas />
    </div>
  );
};

export default ImageAnnotation;
