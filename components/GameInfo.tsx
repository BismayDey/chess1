import styles from "../app/Components/GameInfo.module.css";

interface GameInfoProps {
  status: string;
  onReset: () => void;
  aiLevel: number;
  onAILevelChange: (level: number) => void;
  gameMode: "pvp" | "ai";
  onToggleGameMode: () => void;
  timeLimit: number;
  onTimeLimitChange: (time: number) => void;
}

export default function GameInfo({
  status,
  onReset,
  aiLevel,
  onAILevelChange,
  gameMode,
  onToggleGameMode,
  timeLimit,
  onTimeLimitChange,
}: GameInfoProps) {
  return (
    <div className={styles.gameInfo}>
      <p className={styles.status}>{status}</p>
      <button className={styles.resetButton} onClick={onReset}>
        Reset Game
      </button>
      <div className={styles.modeToggle}>
        <label htmlFor="gameMode">Game Mode:</label>
        <select id="gameMode" value={gameMode} onChange={onToggleGameMode}>
          <option value="pvp">Player vs Player</option>
          <option value="ai">Player vs AI</option>
        </select>
      </div>
      {gameMode === "ai" && (
        <div className={styles.aiSettings}>
          <label htmlFor="aiLevel">AI Level:</label>
          <select
            id="aiLevel"
            value={aiLevel}
            onChange={(e) => onAILevelChange(parseInt(e.target.value))}
          >
            <option value={1}>Easy</option>
            <option value={3}>Medium</option>
            <option value={5}>Hard</option>
          </select>
        </div>
      )}
      <div className={styles.timeSettings}>
        <label htmlFor="timeLimit">Time Limit (minutes):</label>
        <select
          id="timeLimit"
          value={timeLimit}
          onChange={(e) => onTimeLimitChange(parseInt(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={30}>30</option>
          <option value={60}>60</option>
        </select>
      </div>
    </div>
  );
}
