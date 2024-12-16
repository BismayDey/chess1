import { Piece } from "chess.js";
import { ChessPieces } from "./ChessPieces";
import styles from "../app/Components/Square.module.css";

interface SquareProps {
  piece: Piece | null;
  square: string;
  onClick: () => void;
  isSelected: boolean;
  isPossibleMove: boolean;
}

export default function Square({
  piece,
  square,
  onClick,
  isSelected,
  isPossibleMove,
}: SquareProps) {
  const isLight = (square.charCodeAt(0) + parseInt(square[1])) % 2 === 0;

  return (
    <div
      className={`
        ${styles.square} 
        ${isLight ? styles.light : styles.dark}
        ${isSelected ? styles.selected : ""}
        ${isPossibleMove ? styles.possibleMove : ""}
      `}
      onClick={onClick}
    >
      {piece && (
        <div className={styles.piece}>
          {
            ChessPieces[
              `${piece.color}${piece.type}` as keyof typeof ChessPieces
            ]
          }
        </div>
      )}
      {isPossibleMove && !piece && (
        <div className={styles.possibleMoveIndicator} />
      )}
    </div>
  );
}
