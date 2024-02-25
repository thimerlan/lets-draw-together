// import React, { useEffect, useRef, useState } from "react";

// const DrawingBoard = ({
//   width,
//   height,
//   selectedBoardID,
//   setSelectedBoardID,
// }: {
//   width: number;
//   height: number;
//   selectedBoardID: string;
//   setSelectedBoardID: (value: string) => void;
// }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [drawingData, setDrawingData] = useState<any[]>([]);
//   const [boardScale, setBoardScale] = useState(1);
//   const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas?.getContext("2d");

//     if (!context) return;

//     context.strokeStyle = "gold";
//     context.lineJoin = "round";
//     context.lineWidth = 2;

//     // Apply scale transformation
//     context.scale(boardScale, boardScale);

//     // Update scale offset when board scale changes
//     setScaleOffset((prevOffset) => ({
//       x: prevOffset.x / boardScale,
//       y: prevOffset.y / boardScale,
//     }));
//   }, [boardScale]);

//   const handleZoomIn = () => {
//     setBoardScale(boardScale + 0.1);
//   };

//   const handleZoomOut = () => {
//     setBoardScale(boardScale - 0.1);
//   };

//   const startDrawing = (
//     event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
//   ) => {
//     setIsDrawing(true);
//     const { offsetX, offsetY } = event.nativeEvent;
//     setDrawingData((prevData) => [...prevData, [{ x: offsetX, y: offsetY }]]);
//   };

//   const draw = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
//     if (!isDrawing || !canvasRef.current) return;

//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");

//     if (!context) return;

//     const { offsetX, offsetY } = event.nativeEvent;
//     const updatedDrawingData = [...drawingData];
//     const lastPath = updatedDrawingData[updatedDrawingData.length - 1];

//     // Adjust coordinates based on scale and scale offset
//     lastPath.push({
//       x: Math.round((offsetX - scaleOffset.x) / boardScale),
//       y: Math.round((offsetY - scaleOffset.y) / boardScale),
//     });

//     setDrawingData(updatedDrawingData);
//   };

//   const endDrawing = () => {
//     setIsDrawing(false);
//     saveDrawingToFirebase();
//   };

//   function saveDrawingToFirebase() {
//     // Save drawing data to Firebase
//   }

//   useEffect(() => {
//     // Fetch drawing data from Firebase
//   }, []);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const context = canvas.getContext("2d");
//     if (!context) return;

//     context.clearRect(0, 0, canvas.width, canvas.height);
//     drawingData.forEach((path) => {
//       context.beginPath();
//       Object.values(path).forEach(({ x, y }: any, index: number) => {
//         if (index === 0) {
//           context.moveTo(x, y);
//         } else {
//           context.lineTo(x, y);
//         }
//       });
//       context.stroke();
//     });
//   }, [drawingData, boardScale, scaleOffset]);

//   return (
//     <div className="sweet-canvas">
//       <div className="canvas-tools">
//         <div className="scale-board">
//           <button onClick={handleZoomIn}>Zoom in</button>
//           <button onClick={handleZoomOut}>Zoom out</button>
//         </div>
//       </div>
//       <canvas
//         ref={canvasRef}
//         width={width * boardScale}
//         height={height * boardScale}
//         onMouseDown={startDrawing}
//         onMouseMove={draw}
//         onMouseUp={endDrawing}
//         onMouseOut={endDrawing}
//         style={{ border: "1px solid black" }} // Adding border for visualization
//       />
//       <div className="leave-board">
//         <button onClick={() => setSelectedBoardID("")}>leave</button>
//       </div>
//     </div>
//   );
// };

// export default DrawingBoard;
