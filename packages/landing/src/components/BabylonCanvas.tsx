import React, { useEffect, useRef } from "react"

import init from "./game/init"

const BabylonCanvas = (props: { className?: string }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current) {
      init(canvasRef.current)
    }
  }, [canvasRef])

  return <canvas width={800} height={800} className={props.className} ref={canvasRef}></canvas>
}

export default BabylonCanvas
