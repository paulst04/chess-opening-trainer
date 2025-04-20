import { Injectable } from '@angular/core';
import { ChessMove } from '../computer-mode/models';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Color, FENChar } from 'src/app/chess-logic/models';
import { getChessMove } from './openings';
import { chessOpeningStatus } from './models';
import { getOpeningColor, getRandomOpeningName } from './openings';
import { ChessBoardService } from '../chess-board/chess-board.service';

@Injectable({
    providedIn: 'root'
})
export class OpeningKnowledgeService {

    constructor(private chessBoardService: ChessBoardService) { }

    public requestBoardReset(): void {
        console.log("Requesting ChessBoard reset...");
        // this.chessBoardcomponent.resetBoard(); // Resets board via BehaviorSubject
    }

    private convertColumnLetterToYCoord(string: string): number {
        return string.charCodeAt(0) - "a".charCodeAt(0);
    }

    private promotedPiece(piece: string | undefined): FENChar | null {
        if (!piece) return null;
        const computerColor: Color = Color.White;
        if (piece === "n") return computerColor === Color.White ? FENChar.WhiteKnight : FENChar.BlackKnight;
        if (piece === "b") return computerColor === Color.White ? FENChar.WhiteBishop : FENChar.BlackBishop;
        if (piece === "r") return computerColor === Color.White ? FENChar.WhiteRook : FENChar.BlackRook;
        return computerColor === Color.White ? FENChar.WhiteQueen : FENChar.BlackQueen;
    }

    private moveFromString(move: string): ChessMove {
        const prevY: number = this.convertColumnLetterToYCoord(move[0]);
        const prevX: number = Number(move[1]) - 1;
        const newY: number = this.convertColumnLetterToYCoord(move[2]);
        const newX: number = Number(move[3]) - 1;
        const promotedPiece = this.promotedPiece(move[4]);
        return { prevX, prevY, newX, newY, promotedPiece };
    }

    public getNextOpeningMove(openingStatus: chessOpeningStatus): Observable<ChessMove> {
        const bestMove = getChessMove(openingStatus.name, openingStatus.openingIndex, openingStatus.color)
        console.log(bestMove)
        if (!bestMove) {
            console.error('opening over')
        }
        return of(this.moveFromString(bestMove));
    }

    public startNewOpening(openingStatus: chessOpeningStatus): void {
        openingStatus.name = getRandomOpeningName();
        openingStatus.color = getOpeningColor(openingStatus.name);
        openingStatus.openingIndex = 0;
        //reset board
    }
}
