import { Color } from 'src/app/chess-logic/models';

export function getChessMove(opening: string, moveNumber: number, color: Color): string {
    const move = openings[opening as keyof typeof openings]?.moves[moveNumber];

    // If move is undefined or color is missing, return an empty string
    return (color === Color.White ? move?.w : move?.b) ?? "";
}

export function getOpeningColor(opening: string): Color {
    const color = openings[opening as keyof typeof openings]?.color;
    return color
}

export function getRandomOpeningName(){
    const openingNames = Object.keys(openings);
    return openingNames[Math.floor(Math.random() * openingNames.length)];
}

const openings = {
    QueenGambit: {
        color: Color.Black,
        moves: [
            {
                w: "d2d4",
                b: "d7d5"
            },
            {
                w: "c2c4",
                b: "e7e6"
            },
            {
                w: "c4d5",
                b: "e6d5"
            },
            {
                w: "g1f3",
                b: "b8c6"
            }
        ]
    },
    Carokann: {
        color: Color.White,
        moves: [
            {
                w: "e2e4",
                b: "c7c6"
            },
            {
                w: "d2d4",
                b: "d7d5"
            }
        ]
    }
};