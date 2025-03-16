import { Color } from 'src/app/chess-logic/models';
import { ChessMove } from '../computer-mode/models';

export function getChessMove(opening: keyof typeof openings, moveNumber: number, color: Color): ChessMove {
    const move = openings[opening]?.moves[moveNumber];
    // if (!move) return null; // Return null if moveNumber is out of range

    return color === Color.White ? move.w : move.b;
}

const openings = {
    QueenGambit: {
        color: Color.Black,
        moves: [
            {
                w: { prevX: 1, prevY: 3, newX: 3, newY: 3, promotedPiece: null },
                b: { prevX: 6, prevY: 3, newX: 4, newY: 3, promotedPiece: null }
            },
            {
                w: { prevX: 1, prevY: 4, newX: 3, newY: 4, promotedPiece: null },
                b: { prevX: 6, prevY: 4, newX: 4, newY: 4, promotedPiece: null }
            }
        ]
    },
    RuyLopez: {
        color: Color.White,
        moves: [
            {
                w: { prevX: 1, prevY: 4, newX: 3, newY: 4, promotedPiece: null },
                b: { prevX: 6, prevY: 4, newX: 4, newY: 4, promotedPiece: null }
            },
            {
                w: { prevX: 1, prevY: 3, newX: 3, newY: 3, promotedPiece: null },
                b: { prevX: 6, prevY: 3, newX: 4, newY: 3, promotedPiece: null }
            }
        ]
    }
};
