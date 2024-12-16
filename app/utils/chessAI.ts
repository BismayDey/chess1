import { Chess, Square, PieceSymbol } from 'chess.js'

const pieceValues: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
}

const pawnEvalWhite = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5,  5, 10, 25, 25, 10,  5,  5],
  [0,  0,  0, 20, 20,  0,  0,  0],
  [5, -5,-10,  0,  0,-10, -5,  5],
  [5, 10, 10,-20,-20, 10, 10,  5],
  [0,  0,  0,  0,  0,  0,  0,  0]
]

const pawnEvalBlack = pawnEvalWhite.slice().reverse()

const knightEval = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,  0,  0,  0,  0,-20,-40],
  [-30,  0, 10, 15, 15, 10,  0,-30],
  [-30,  5, 15, 20, 20, 15,  5,-30],
  [-30,  0, 15, 20, 20, 15,  0,-30],
  [-30,  5, 10, 15, 15, 10,  5,-30],
  [-40,-20,  0,  5,  5,  0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50]
]

const bishopEvalWhite = [
  [-20,-10,-10,-10,-10,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5, 10, 10,  5,  0,-10],
  [-10,  5,  5, 10, 10,  5,  5,-10],
  [-10,  0, 10, 10, 10, 10,  0,-10],
  [-10, 10, 10, 10, 10, 10, 10,-10],
  [-10,  5,  0,  0,  0,  0,  5,-10],
  [-20,-10,-10,-10,-10,-10,-10,-20]
]

const bishopEvalBlack = bishopEvalWhite.slice().reverse()

const rookEvalWhite = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [5, 10, 10, 10, 10, 10, 10,  5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [-5,  0,  0,  0,  0,  0,  0, -5],
  [0,  0,  0,  5,  5,  0,  0,  0]
]

const rookEvalBlack = rookEvalWhite.slice().reverse()

const evalQueen = [
  [-20,-10,-10, -5, -5,-10,-10,-20],
  [-10,  0,  0,  0,  0,  0,  0,-10],
  [-10,  0,  5,  5,  5,  5,  0,-10],
  [-5,  0,  5,  5,  5,  5,  0, -5],
  [0,  0,  5,  5,  5,  5,  0, -5],
  [-10,  5,  5,  5,  5,  5,  0,-10],
  [-10,  0,  5,  0,  0,  0,  0,-10],
  [-20,-10,-10, -5, -5,-10,-10,-20]
]

const kingEvalWhite = [
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-30,-40,-40,-50,-50,-40,-40,-30],
  [-20,-30,-30,-40,-40,-30,-30,-20],
  [-10,-20,-20,-20,-20,-20,-20,-10],
  [20, 20,  0,  0,  0,  0, 20, 20],
  [20, 30, 10,  0,  0, 10, 30, 20]
]

const kingEvalBlack = kingEvalWhite.slice().reverse()

function getPieceValue(piece: Chess.Piece | null, x: number, y: number): number {
  if (piece === null) {
    return 0
  }

  const absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x, y)
  return piece.color === 'w' ? absoluteValue : -absoluteValue
}

function getAbsoluteValue(piece: Chess.Piece, isWhite: boolean, x: number, y: number): number {
  if (!piece || !piece.type) {
    return 0 // Return 0 for undefined pieces or types
  }

  const pieceType = piece.type as PieceSymbol

  if (!(pieceType in pieceValues)) {
    console.error('Unknown piece type:', pieceType)
    return 0 // Return 0 for unknown piece types
  }

  switch (pieceType) {
    case 'p':
      return pieceValues[pieceType] + (isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x])
    case 'r':
      return pieceValues[pieceType] + (isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x])
    case 'n':
      return pieceValues[pieceType] + knightEval[y][x]
    case 'b':
      return pieceValues[pieceType] + (isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x])
    case 'q':
      return pieceValues[pieceType] + evalQueen[y][x]
    case 'k':
      return pieceValues[pieceType] + (isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x])
    default:
      console.error('Unexpected piece type:', pieceType)
      return 0
  }
}

function evaluateBoard(game: Chess): number {
  let totalEvaluation = 0
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      const square = String.fromCharCode(97 + x) + (8 - y) as Square
      const piece = game.get(square)
      totalEvaluation += getPieceValue(piece, x, y)
    }
  }
  return totalEvaluation
}

function minimax(game: Chess, depth: number, alpha: number, beta: number, isMaximizingPlayer: boolean): number {
  if (depth === 0) {
    return evaluateBoard(game)
  }

  const moves = game.moves({ verbose: true })

  if (isMaximizingPlayer) {
    let bestScore = -Infinity
    for (const move of moves) {
      game.move(move)
      const score = minimax(game, depth - 1, alpha, beta, false)
      game.undo()
      bestScore = Math.max(bestScore, score)
      alpha = Math.max(alpha, bestScore)
      if (beta <= alpha) {
        break
      }
    }
    return bestScore
  } else {
    let bestScore = Infinity
    for (const move of moves) {
      game.move(move)
      const score = minimax(game, depth - 1, alpha, beta, true)
      game.undo()
      bestScore = Math.min(bestScore, score)
      beta = Math.min(beta, bestScore)
      if (beta <= alpha) {
        break
      }
    }
    return bestScore
  }
}

export function findBestMove(game: Chess, depth: number): string | null {
  const moves = game.moves({ verbose: true })
  let bestMove: Chess.Move | null = null
  let bestScore = -Infinity

  for (const move of moves) {
    game.move(move)
    const score = minimax(game, depth - 1, -Infinity, Infinity, false)
    game.undo()

    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove ? `${bestMove.from}${bestMove.to}` : null
}

