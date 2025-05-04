import { Color } from 'src/app/chess-logic/models';
import { LocalStorageService } from '../../local-storage.service';

const openings = {
  QueenGambit: {
    color: Color.Black,
    moves: [
      { w: "d2d4", b: "d7d5" },
      { w: "c2c4", b: "e7e6" },
      { w: "c4d5", b: "e6d5" },
      { w: "g1f3", b: "b8c6" }
    ]
  },
  Carokann: {
    color: Color.White,
    moves: [
      { w: "e2e4", b: "c7c6" },
      { w: "d2d4", b: "d7d5" },
      { w: "e4e5", b: "c6c5" }
    ]
  },
  Test: {
    color: Color.White,
    moves: [
      { w: "e2e4", b: "c7c6" },
      { w: "d2d4", b: "d7d5" },
      { w: "e4e5", b: "c6c5" }
    ]
  }
};

export function getChessMove(opening: string, moveNumber: number, color: Color): string {
    const move = openings[opening as keyof typeof openings]?.moves[moveNumber];

    // If move is undefined or color is missing, return an empty string
    return (color === Color.White ? move?.w : move?.b) ?? "";
}

export function getOpeningColor(opening: string): Color {
    const color = openings[opening as keyof typeof openings]?.color;
    return color
}

export function getRandomOpeningName(): string {
    const openingNamesAsString = localStorage.getItem('openingNames')
    console.log(openingNamesAsString)
    const openingNames = openingNamesAsString ? JSON.parse(openingNamesAsString) : Object.keys(openings)
    const randomOpeningIndex = Math.floor(Math.random() * openingNames.length);
    const opening = openingNames[randomOpeningIndex];
    openingNames.splice(randomOpeningIndex, 1); // removes the element from the array
    console.log(openingNames, opening)
    localStorage.setItem('openingNames', JSON.stringify(openingNames.length > 0 ? openingNames : Object.keys(openings))); //update openings
    return opening;
}