import React, { useEffect, useRef } from "react";
import init from "./game/init";

const BabylonCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      init(canvasRef.current);
    }
  }, [canvasRef]);

  return <canvas width={900} height={600} ref={canvasRef}></canvas>;
};

export default BabylonCanvas;
