"use client";

import { useState, useEffect, useCallback } from "react";
import { Chess, Move, Square } from "chess.js";
import Board from "../components/Board";
import GameInfo from "../components/GameInfo";
import MoveHistory from "../components/MoveHistory";
import Clock from "../components/Clock";
import { findBestMove } from "./utils/chessAI";
import styles from "./page.module.css";

export default function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [currentPlayer, setCurrentPlayer] = useState<"w" | "b">("w");
  const [status, setStatus] = useState("");
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [aiLevel, setAiLevel] = useState(3);
  const [timeLimit, setTimeLimit] = useState(10);
  const [timeLeft, setTimeLeft] = useState({ w: 600, b: 600 });
  const [gameMode, setGameMode] = useState<"pvp" | "ai">("pvp");
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);

  useEffect(() => {
    updateStatus();
    const timer = setInterval(() => {
      setTimeLeft((prev) => ({
        ...prev,
        [currentPlayer]: Math.max(0, prev[currentPlayer] - 1),
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [game, currentPlayer]);

  const updateStatus = useCallback(() => {
    let status = "";
    if (game.isCheckmate()) {
      status = `Checkmate! ${currentPlayer === "w" ? "Black" : "White"} wins!`;
    } else if (game.isDraw()) {
      status = "Draw!";
    } else if (game.isCheck()) {
      status = `${currentPlayer === "w" ? "White" : "Black"} is in check`;
    } else {
      status = `${currentPlayer === "w" ? "White" : "Black"} to move`;
    }
    setStatus(status);
  }, [game, currentPlayer]);

  const handleMove = useCallback(
    (from: Square, to: Square) => {
      try {
        const move = game.move({ from, to, promotion: "q" }); // Always promote to queen for simplicity
        if (move) {
          setGame(new Chess(game.fen()));
          setCurrentPlayer(currentPlayer === "w" ? "b" : "w");
          setMoveHistory(game.history({ verbose: true }));
          setSelectedSquare(null);
          setPossibleMoves([]);
          updateStatus();

          if (gameMode === "ai" && currentPlayer === "w") {
            setTimeout(makeAIMove, 250);
          }
        }
      } catch (error) {
        console.error("Invalid move:", error);
      }
    },
    [game, currentPlayer, gameMode, updateStatus]
  );

  const makeAIMove = useCallback(() => {
    const bestMove = findBestMove(game, aiLevel);
    if (bestMove) {
      handleMove(bestMove.from as Square, bestMove.to as Square);
    }
  }, [game, aiLevel, handleMove]);

  const handleSquareClick = useCallback(
    (square: Square) => {
      if (selectedSquare === null) {
        const piece = game.get(square);
        if (piece && piece.color === currentPlayer) {
          setSelectedSquare(square);
          setPossibleMoves(
            game
              .moves({ square, verbose: true })
              .map((move) => move.to as Square)
          );
        }
      } else {
        if (possibleMoves.includes(square)) {
          handleMove(selectedSquare, square);
        } else {
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      }
    },
    [selectedSquare, possibleMoves, game, currentPlayer, handleMove]
  );

  const resetGame = useCallback(() => {
    setGame(new Chess());
    setCurrentPlayer("w");
    setMoveHistory([]);
    setTimeLeft({ w: timeLimit * 60, b: timeLimit * 60 });
    setSelectedSquare(null);
    setPossibleMoves([]);
    updateStatus();
  }, [timeLimit, updateStatus]);

  const handleAILevelChange = useCallback((level: number) => {
    setAiLevel(level);
  }, []);

  const toggleGameMode = useCallback(() => {
    setGameMode((prevMode) => (prevMode === "pvp" ? "ai" : "pvp"));
    resetGame();
  }, [resetGame]);

  const handleTimeLimitChange = useCallback((time: number) => {
    setTimeLimit(time);
    setTimeLeft({ w: time * 60, b: time * 60 });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Chess Game</h1>
      <div className={styles.gameArea}>
        <Board
          game={game}
          currentPlayer={currentPlayer}
          onSquareClick={handleSquareClick}
          selectedSquare={selectedSquare}
          possibleMoves={possibleMoves}
        />
        <div className={styles.sidebar}>
          <GameInfo
            status={status}
            onReset={resetGame}
            aiLevel={aiLevel}
            onAILevelChange={handleAILevelChange}
            gameMode={gameMode}
            onToggleGameMode={toggleGameMode}
            timeLimit={timeLimit}
            onTimeLimitChange={handleTimeLimitChange}
          />
          <Clock time={timeLeft} currentPlayer={currentPlayer} />
          <MoveHistory moves={moveHistory} />
        </div>
      </div>
    </div>
  );
}
