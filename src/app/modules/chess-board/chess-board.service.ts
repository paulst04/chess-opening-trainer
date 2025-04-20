import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FENConverter } from 'src/app/chess-logic/FENConverter';

@Injectable({
  providedIn: 'root'
})
export class ChessBoardService {
  public chessBoardState$ = new BehaviorSubject<string>(FENConverter.initalPosition);

  constructor() {}

  // /** Resets the board by setting the FEN string to the initial position */
  // public resetBoard(): void {
  //   console.log(FENConverter.initalPosition);
  //   this.chessBoardState$.next(FENConverter.initalPosition); // Notify subscribers
  // }
}