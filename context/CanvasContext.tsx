"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
  MutableRefObject,
  useEffect,
  useCallback,
} from "react";

type CanvasContextType = {
  ctx: CanvasRenderingContext2D | null;
  setCtx: (ctx: CanvasRenderingContext2D | null) => void;
  undoStack: ImageData[];
  setUndoStack: (stack: ImageData[] | any) => void;
  imgRef: MutableRefObject<HTMLImageElement | null>;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  canvasDimensions: canvasDimensions;
  setCanvasDimensions: (dimensions: canvasDimensions) => void;
  boxes: BoundingBox[];
  setBoxes: (boxes: BoundingBox[]) => void;
};

type Point = { x: number; y: number };

type canvasDimensions = {
  height: number;
  width: number;
};

interface BoundingBox {
  leftTop: Point;
  rightBottom: Point;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const forceAspectRatio = useRef<boolean>(false);
  const [boxes, setBoxes] = useState<BoundingBox[]>([]);
  const [canvasDimensions, setCanvasDimensions] = useState<canvasDimensions>({
    height: 50,
    width: 100,
  });

  const drawBoxes = useCallback((boxes: BoundingBox[])  => {
    const canvas = canvasRef.current;

      if (!ctx || !canvas) return;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      Object.values(boxes).forEach(coord => {
          const x = coord.leftTop.x * canvasWidth;
          const y = coord.leftTop.y * canvasHeight;
          const width = (coord.rightBottom.x - coord.leftTop.x) * canvasWidth;
          const height = (coord.rightBottom.y - coord.leftTop.y) * canvasHeight;

          ctx.beginPath();
          ctx.rect(x, y, width, height);
          ctx.strokeStyle = "red";  // You can change the color here
          ctx.lineWidth = 2;        // You can change the thickness here
          ctx.stroke();
      });
  }, [ctx]);

  useEffect(() => {
    drawBoxes(boxes);
  }, [boxes, drawBoxes]);

  return (
    <CanvasContext.Provider
      value={{
        ctx,
        setCtx,
        undoStack,
        setUndoStack,
        imgRef,
        canvasRef,
        canvasDimensions,
        setCanvasDimensions,
        // forceAspectRatio,
        boxes,
        setBoxes,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error("useCanvasContext must be used within a CanvasProvider");
  }
  return context;
};
