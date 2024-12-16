import styles from "../app/Components/Clock.module.css";

interface ClockProps {
  time: { w: number; b: number };
  currentPlayer: string;
}

export default function Clock({ time, currentPlayer }: ClockProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.clock}>
      <div
        className={`${styles.playerClock} ${
          currentPlayer === "w" ? styles.active : ""
        }`}
      >
        White: {formatTime(time.w)}
      </div>
      <div
        className={`${styles.playerClock} ${
          currentPlayer === "b" ? styles.active : ""
        }`}
      >
        Black: {formatTime(time.b)}
      </div>
    </div>
  );
}
