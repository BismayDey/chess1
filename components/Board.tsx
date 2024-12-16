import { Chess, Square as ChessSquare } from "chess.js";
import Square from "./Square";
import styles from "../app/Components/Board.module.css";

interface BoardProps {
  game: Chess;
  currentPlayer: string;
  onSquareClick: (square: ChessSquare) => void;
  selectedSquare: ChessSquare | null;
  possibleMoves: ChessSquare[];
}

export default function Board({
  game,
  currentPlayer,
  onSquareClick,
  selectedSquare,
  possibleMoves,
}: BoardProps) {
  const board = game.board();

  return (
    <div className={styles.board}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((piece, colIndex) => {
            const square = `${String.fromCharCode(97 + colIndex)}${
              8 - rowIndex
            }` as ChessSquare;
            return (
              <Square
                key={square}
                piece={piece}
                square={square}
                onClick={() => onSquareClick(square)}
                isSelected={square === selectedSquare}
                isPossibleMove={possibleMoves.includes(square)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
