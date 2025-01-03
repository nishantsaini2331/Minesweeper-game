import React, { useState } from "react";
import "./App.css";

const App = () => {
  const GRID_SIZE = 8;
  const MINE_COUNT = 10;

  const createBoard = () => {
    const board = Array(GRID_SIZE)
      .fill()
      .map(() =>
        Array(GRID_SIZE)
          .fill()
          .map(() => ({
            isMine: false,
            isRevealed: false,
            neighborMines: 0,
            isFlagged: false,
          }))
      );

      
    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);

      if (!board[x][y].isMine) {
        board[x][y].isMine = true;
        minesPlaced++;
      }
    }
    
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (!board[i][j].isMine) {
          let count = 0;
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              const ni = i + di;
              const nj = j + dj;
              if (
                ni >= 0 &&
                ni < GRID_SIZE &&
                nj >= 0 &&
                nj < GRID_SIZE &&
                board[ni][nj].isMine
              ) {
                count++;
              }
            }
          }
          board[i][j].neighborMines = count;
        }
      }
    }

    return board;
  };

  const [board, setBoard] = useState(createBoard());
  const [gameStatus, setGameStatus] = useState("playing");

  const revealCell = (x, y) => {
    if (
      gameStatus !== "playing" ||
      board[x][y].isRevealed ||
      board[x][y].isFlagged
    )
      return;

    const newBoard = JSON.parse(JSON.stringify(board));

    if (board[x][y].isMine) {
      setGameStatus("lost");
      // Reveal all mines
      board.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (cell.isMine) newBoard[i][j].isRevealed = true;
        });
      });
    } else {
     
        
      const floodFill = (i, j) => {
        if (
          i < 0 ||
          i >= GRID_SIZE ||
          j < 0 ||
          j >= GRID_SIZE ||
          newBoard[i][j].isRevealed ||
          newBoard[i][j].isMine
        )
          return;

        newBoard[i][j].isRevealed = true;

        if (newBoard[i][j].neighborMines === 0) {
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              floodFill(i + di, j + dj);
            }
          }
        }
      };

      floodFill(x, y);
    }

    setBoard(newBoard);
    checkWin(newBoard);
  };

  const toggleFlag = (e, x, y) => {
    e.preventDefault();
    if (gameStatus !== "playing" || board[x][y].isRevealed) return;

    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard[x][y].isFlagged = !newBoard[x][y].isFlagged;
    setBoard(newBoard);
  };

  const checkWin = (currentBoard) => {
    const allNonMinesRevealed = currentBoard.every((row) =>
      row.every((cell) => cell.isMine || cell.isRevealed)
    );
    if (allNonMinesRevealed) setGameStatus("won");
  };

  const resetGame = () => {
    setBoard(createBoard());
    setGameStatus("playing");
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-4 items-center">
        <div className="text-lg font-bold">
          {gameStatus === "won"
            ? "🎉 You Won!"
            : gameStatus === "lost"
            ? "💥 Game Over!"
            : "😊 Playing"}
        </div>
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          New Game
        </button>
      </div>

      <div className="grid gap-1 p-4 bg-gray-200 rounded">
        {board.map((row, i) => (
          <div key={i} className="flex gap-1">
            {row.map((cell, j) => (
              <button
                key={`${i}-${j}`}
                onClick={() => revealCell(i, j)}
                onContextMenu={(e) => toggleFlag(e, i, j)}
                className={`w-12 h-12 flex items-center justify-center font-bold border
                  ${
                    cell.isRevealed
                      ? cell.isMine
                        ? "bg-red-500 text-white"
                        : "bg-yellow-700"
                      : "bg-green-500 hover:bg-gray-400"
                  }`}
              >
                {cell.isFlagged
                  ? "🚩"
                  : cell.isRevealed
                  ? cell.isMine
                    ? "💣"
                    : cell.neighborMines > 0
                    ? cell.neighborMines
                    : ""
                  : ""}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
