import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { boardsDB } from "../../../firebaseConfig";

import { TbEdit } from "react-icons/tb";
import { MdOutlineClose, MdZoomIn, MdZoomOut } from "react-icons/md";

import "./DrawingBoard.scss";

interface IDrawingBoardProps {
  width: number;
  height: number;
  selectedBoardID: string;
  setSelectedBoardID: (value: string) => void;
}

const DrawingBoard = ({
  width,
  height,
  selectedBoardID,
  setSelectedBoardID,
}: IDrawingBoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingData, setDrawingData] = useState<
    Array<Array<{ x: number; y: number }>>
  >([]);

  const [boardScale, setBoardScale] = useState(1);
  const [showCanvasToolModal, setShowCanvasToolModal] = useState(false);
  const [backgroundColorOfCanvas, setBackgroundColorOfCanvas] =
    useState("#706767");

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!context) return;
    if (!canvas) return;

    context.strokeStyle = "gold";
    context.lineJoin = "round";

    context.lineWidth = 2;

    context.scale(boardScale, boardScale);
  }, [boardScale]);

  const handleZoomIn = () => {
    if (boardScale < 2.0) {
      setBoardScale(boardScale + 0.1);
    }
  };

  const handleZoomOut = () => {
    if (boardScale > 0.1) {
      setBoardScale(boardScale - 0.1);
    }
  };

  const startDrawing = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = event.nativeEvent;
    setDrawingData((prevData) => [...prevData, [{ x: offsetX, y: offsetY }]]);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    const { offsetX, offsetY } = event.nativeEvent;

    const scaledX = offsetX / boardScale;
    const scaledY = offsetY / boardScale;

    const updatedDrawingData = [...drawingData];

    if (
      updatedDrawingData.length === 0 ||
      updatedDrawingData[updatedDrawingData.length - 1].length === 0
    ) {
      updatedDrawingData.push([{ x: scaledX, y: scaledY }]);
    } else {
      const lastPath = updatedDrawingData[updatedDrawingData.length - 1];

      const lastPoint = lastPath[lastPath.length - 1];

      const distance = Math.sqrt(
        Math.pow(scaledX - lastPoint.x, 2) + Math.pow(scaledY - lastPoint.y, 2)
      );

      const threshold = 50 / boardScale;

      if (distance > threshold) {
        updatedDrawingData.push([{ x: scaledX, y: scaledY }]);
      } else {
        lastPath.push({ x: scaledX, y: scaledY });
      }
    }

    setDrawingData(updatedDrawingData);
  };

  const endDrawing = () => {
    saveDrawingToFirebase();
    setIsDrawing(false);
  };

  function saveDrawingToFirebase() {
    const drawingRef = ref(boardsDB, `boardCanvasList/${selectedBoardID}`);
    set(drawingRef, drawingData);
  }
  useEffect(() => {
    const drawingRef = ref(boardsDB, `boardCanvasList/${selectedBoardID}`);

    const unsubscribe = onValue(drawingRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setDrawingData(data);
      } else {
        console.log("Drawing Datas not found");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    drawingData.forEach((path) => {
      context.beginPath();
      for (const { x, y } of path) {
        context.lineTo(x, y);
      }
      context.stroke();
    });
  }, [drawingData, boardScale]);

  return (
    <div className="sweet-canvas">
      {!showCanvasToolModal && (
        <div className="show-canvas-tool">
          <button
            onClick={() => setShowCanvasToolModal(!showCanvasToolModal)}
            title="open the canvas tool"
          >
            <TbEdit />
          </button>
        </div>
      )}
      <div
        className="canvas-tools"
        style={{ right: `${showCanvasToolModal ? "-25%" : "-65%"} ` }}
      >
        <div className="scale-board">
          <button onClick={handleZoomIn} disabled={boardScale >= 2.0}>
            <MdZoomIn size={25} />
          </button>
          <span className="calculated-scale-percent">{`${(
            boardScale * 100
          ).toFixed()}%`}</span>
          <button onClick={handleZoomOut} disabled={boardScale <= 0.2}>
            <MdZoomOut size={25} />
          </button>
        </div>

        <input
          type="color"
          value={backgroundColorOfCanvas}
          className="changeBackgroundColorOfCanvas-input"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setBackgroundColorOfCanvas(e.target.value)
          }
        />
        <button
          className="leave-board-btn"
          onClick={() => setSelectedBoardID("")}
        >
          leave
        </button>

        <button
          className="close-canvas-tools"
          onClick={() => setShowCanvasToolModal(!showCanvasToolModal)}
        >
          <MdOutlineClose />
        </button>
      </div>
      <div className="canvas">
        <canvas
          ref={canvasRef}
          width={width * boardScale}
          height={height * boardScale}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseOut={endDrawing}
          style={{ backgroundColor: backgroundColorOfCanvas }}
        />
      </div>
    </div>
  );
};

export default DrawingBoard;
