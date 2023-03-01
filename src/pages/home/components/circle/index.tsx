import { useEffect, useRef, useState } from "react";

interface CircleProps {
  pos: { x: number; y: number };
}

function Circle({ pos }: CircleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bigCircleRadius = 50; // radius of big circle
  const [smallCirclePos, setSmallCirclePos] = useState<{
    x: number;
    y: number;
  }>({
    x: pos.x + bigCircleRadius,
    y: pos.y,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    function draw() {
      // Clear the canvas
      context?.clearRect(0, 0, canvas?.width ?? 0, canvas?.height ?? 0);

      // Draw the larger circle
      context?.beginPath();
      context?.arc(pos.x, pos.y, bigCircleRadius, 0, 2 * Math.PI);
      context?.stroke();

      // Draw the small circle
      context?.beginPath();
      context?.arc(smallCirclePos.x, smallCirclePos.y, 5, 0, 2 * Math.PI);
      context?.fill();
    }

    draw();

    function handleMouseDown(e: MouseEvent) {
      const mousePos = getMousePos(canvasRef.current!, e);
      const distance = getDistance(mousePos, smallCirclePos);

      // Check if mouse is clicked inside the small circle
      if (distance <= 5) {
        setIsDragging(true);
      }
    }

    function handleMouseMove(e: MouseEvent) {
      const newMousePos = getMousePos(canvasRef.current!, e);

      if (isDragging) {
        const distance = getDistance(newMousePos, pos);

        if (distance - 20 <= bigCircleRadius) {
          // check if mouse is within the boundary of the big circle
          const angle = getAngle(newMousePos, pos);
          const smallCircleX = pos.x + Math.cos(angle) * bigCircleRadius;
          const smallCircleY = pos.y + Math.sin(angle) * bigCircleRadius;

          setSmallCirclePos({ x: smallCircleX, y: smallCircleY });
        }
      }

      setMousePos(newMousePos);
    }

    function handleMouseUp() {
      setIsDragging(false);
    }

    canvas?.addEventListener("mousedown", handleMouseDown);
    canvas?.addEventListener("mousemove", handleMouseMove);
    canvas?.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas?.removeEventListener("mousedown", handleMouseDown);
      canvas?.removeEventListener("mousemove", handleMouseMove);
      canvas?.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, smallCirclePos]);

  function handleMouseDown(e: MouseEvent) {
    console.log("handleMouseDown");
    const mousePos = getMousePos(canvasRef.current!, e);
    const distance = getDistance(mousePos, smallCirclePos);

    // Check if mouse is clicked inside the small circle
    if (distance <= 5) {
      setIsDragging(true);
    }
  }

  function handleMouseMove(e: MouseEvent) {
    console.log("handleMouseMove");

    const newMousePos = getMousePos(canvasRef.current!, e);

    if (isDragging) {
      const distance = getDistance(newMousePos, pos);

      if (distance <= bigCircleRadius) {
        // check if mouse is within the boundary of the big circle
        const angle = getAngle(newMousePos, pos);
        const smallCircleX = pos.x + Math.cos(angle) * bigCircleRadius;
        const smallCircleY = pos.y + Math.sin(angle) * bigCircleRadius;

        setSmallCirclePos({ x: smallCircleX, y: smallCircleY });
      }
    }

    setMousePos(newMousePos);
  }

  function handleMouseUp() {
    console.log("handleMouseUp");

    setIsDragging(false);
  }

  function getMousePos(canvas: HTMLCanvasElement, e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function getDistance(
    point1: { x: number; y: number },
    point2: { x: number; y: number }
  ) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  function getAngle(
    point1: { x: number; y: number },
    point2: { x: number; y: number }
  ) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;

    return Math.atan2(dy, dx);
  }
  return <canvas ref={canvasRef} width={600} height={600} />;
}

export default Circle;
