import { Move } from "chess.js";
import styles from "../app/Components/MoveHistory.module.css";

interface MoveHistoryProps {
  moves: Move[];
}

export default function MoveHistory({ moves }: MoveHistoryProps) {
  return (
    <div className={styles.moveHistory}>
      <h3>Move History</h3>
      <div className={styles.moveList}>
        {moves.map((move, index) => (
          <div key={index} className={styles.move}>
            {index % 2 === 0 && (
              <span className={styles.moveNumber}>
                {Math.floor(index / 2) + 1}.
              </span>
            )}
            <span className={styles.moveNotation}>{move.san}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
