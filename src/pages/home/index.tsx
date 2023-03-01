import { useState } from "react";
import Circle from "./components/circle";

function Home(): JSX.Element {
  const [circleCount, setCircleCount] = useState<number>(1);
  const [circlePositions, setCirclePositions] = useState<
    { x: number; y: number }[]
  >([{ x: 75, y: 125 }]);

  function handleAddCircle() {
    const newCirclePositions = [...circlePositions];
    newCirclePositions.push({ x: 75, y: 125 });
    setCirclePositions(newCirclePositions);
    setCircleCount(circleCount + 1);
  }

  return (
    <div>
      <button onClick={handleAddCircle}>Add Circle</button>
      {circlePositions.map((pos, index) => (
        <Circle key={index} pos={pos} />
      ))}
    </div>
  );
}

export default Home;
