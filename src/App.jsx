import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [clickedTiles, setClickedTiles] = useState([]);
  console.log("clickedTiles", clickedTiles);

  return (
    <div>
      <div>
        {/* make 8*8 grid  use tailwind*/}
        {/* when click on any tile change color of that tile and i want to give each numbering like 1 to 64 */}
        {/* in grid form */}

        {Array.from({ length: 8 }).map((_, i) => (
          <div className="flex">
            {Array.from({ length: 8 }).map((_, j) => {
              const number = i * 8 + j + 1;
              const isClicked = clickedTiles.includes(number);
              return (
                <div
                  key={number}
                  className={`w-12 h-12 flex items-center justify-center border border-gray-300 ${
                    isClicked ? "bg-green-500" : "bg-gray-100"
                  }`}
                  onClick={() => {
                    if (isClicked) {
                      return;
                    } else {
                      setClickedTiles((prev) => [...prev, number]);
                    }
                  }}
                >
                  {/* {number} */}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
