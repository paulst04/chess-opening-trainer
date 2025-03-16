import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChessMove } from '../computer-mode/models';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { Color, FENChar } from 'src/app/chess-logic/models';
import { getChessMove, getOpeningColor } from './openings';

@Injectable({
    providedIn: 'root'
})
export class OpeningKnowledgeService {

    

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

    private moveFromStockfishString(move: string): ChessMove {
        const prevY: number = this.convertColumnLetterToYCoord(move[0]);
        const prevX: number = Number(move[1]) - 1;
        const newY: number = this.convertColumnLetterToYCoord(move[2]);
        const newX: number = Number(move[3]) - 1;
        const promotedPiece = this.promotedPiece(move[4]);
        return { prevX, prevY, newX, newY, promotedPiece };
    }

    public getBestMove(opening: string, moveNumber: number, color: Color): Observable<ChessMove> {
        const bestMove = getChessMove(opening, moveNumber, color)
        console.log(bestMove)
        if(!bestMove){
            console.log('oops')
        }
        return of(this.moveFromStockfishString(bestMove));
    }
}
