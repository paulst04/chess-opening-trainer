import { Injectable } from '@angular/core';
import { ChessMove } from '../computer-mode/models';
import { Observable, of } from 'rxjs';
import { Color, FENChar, LastMove } from 'src/app/chess-logic/models';
import { getChessMove } from './openings';
import { chessOpeningStatus } from './models';
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
        return of(this.moveFromString(bestMove));
    }
    public getExpectedMove(openingStatus: chessOpeningStatus): ChessMove | null {
        let checkMove = '';
      
        if (openingStatus.color === Color.White && openingStatus.openingIndex > 0) {
          checkMove = getChessMove(openingStatus.name, openingStatus.openingIndex - 1, Color.Black);
        } else if (openingStatus.color === Color.Black) {
          checkMove = getChessMove(openingStatus.name, openingStatus.openingIndex, Color.White);
        } else {
          return null;
        }
      
        return this.moveFromString(checkMove);
      }
      
      public movesAreEqual(a: ChessMove | null, b: LastMove | undefined): boolean {
        if (!a || !b) return false;
      
        return (
          a.prevX === b.prevX &&
          a.prevY === b.prevY &&
          a.newX === b.currX &&
          a.newY === b.currY
        );
      }
      
      public isMoveIncorrect(openingStatus: chessOpeningStatus, lastMove: LastMove | undefined): boolean {
        if (openingStatus.openingIndex === 0) return false;
        if(getChessMove(openingStatus.name, openingStatus.openingIndex, Color.White)===""){
            window.location.reload()
        }
      
        const expectedMove = this.getExpectedMove(openingStatus);
        return !this.movesAreEqual(expectedMove, lastMove);
      }
}
