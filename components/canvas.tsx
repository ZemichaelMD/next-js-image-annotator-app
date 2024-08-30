import { useCanvasContext } from "@/context/CanvasContext";
import React, { useEffect, useRef, useState } from "react";

type canvasDimensions = {
  height: number;
  width: number;
};

export default function Canvas() {
  const [drawing, setDrawing] = useState<boolean>(false);
  const [loadedFileName, setLoadedFileName] = useState<string>("");

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

  useEffect(() => {
    if (canvasRef.current && !ctx) {
      const context = canvasRef.current.getContext("2d");
      setCtx(context);
    }
  }, [canvasRef, ctx, setCtx]);

  const handleImageLoad = () => {
    const img = imgRef.current;

    if (img) {
      const fileElement = document.querySelector("#fileInput");
      const canvasParent = document.querySelector("#canvasParent");

      var parentPositionInfo = canvasParent?.getBoundingClientRect();
      var canvasParentHeight = parentPositionInfo?.height;
      var canvasParentWidth = parentPositionInfo?.width;

      const imageObj = new Image();

      imageObj.onload = function () {
        const imageHeight = imageObj.height;
        const imageWidth = imageObj.width;
        const imageAspectRatio = imageWidth / imageHeight;

        const canvas = canvasRef.current;

        if (fileElement) {
          const file = (fileElement as HTMLInputElement).files?.[0];
          if (file) {
            setLoadedFileName(file.name);
          }
        }

        if (canvas && img && ctx) {
          canvas.width = canvasParentWidth;
          canvas.height = canvasParentWidth / imageAspectRatio;

          ctx.drawImage(img, 0, 0, canvasParentWidth, canvasParentWidth / imageAspectRatio);
          setBoxes(boxes);
        }

        console.log('imageLoaded', imageHeight, imageWidth);
        console.log("height", imageHeight, "width", imageWidth);
      };

      imageObj.src = img.src;
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (ctx) {
      setDrawing(true);
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

      // Save current state to undo stack
      const imageData = ctx.getImageData(
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height
      );
      setUndoStack((prevStack: any) => [...prevStack, imageData].slice(-20)); // Limit stack size
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !ctx) return;
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (ctx) {
      setDrawing(false);
      ctx.closePath();
    }
  };

  return (
    <div id="canvasParent">
      <div id="filename">
        {" "}
        {loadedFileName != ""
          ? `Image File Name : ${loadedFileName}`
          : "No Image Loaded"}{" "}
      </div>
      <canvas
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      ></canvas>
      <img
        id="fileInput"
        alt="Image"
        ref={imgRef}
        src=""
        width={imgRef.current?.width}
        height={imgRef.current?.height}
        onLoad={handleImageLoad}
        style={{ display: "none" }}
      />
    </ div>
  );
}
