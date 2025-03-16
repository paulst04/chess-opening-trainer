import { openings } from './openings';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ChessBoardComponent } from '../chess-board/chess-board.component';
import { ChessBoardService } from '../chess-board/chess-board.service';
import { Subscription } from 'rxjs';
import { Color, FENChar } from 'src/app/chess-logic/models';

interface Move {
  prevX: number;
  prevY: number;
  newX: number;
  newY: number;
  promotedPiece: FENChar | null;
}


interface OpeningMove {
  w: Move;
  b: Move;
}

@Component({
  selector: 'app-opening-knowledge-mode',
  templateUrl: '../chess-board/chess-board.component.html',
  styleUrls: ['../chess-board/chess-board.component.css']
})
export class OpeningKnowledgeModeComponentBak extends ChessBoardComponent implements OnInit, OnDestroy {
  private openingSubscriptions$ = new Subscription();
  private currentOpeningMoves: OpeningMove[] = [];
  private currentMoveIndex = 0;
  // currentOpeningColor indicates which side the user is testing (i.e. the move they must play)
  private currentOpeningColor: Color = Color.White;

  constructor() {
    super(inject(ChessBoardService));
  }

  public override ngOnInit(): void {
    super.ngOnInit();
    this.startNewOpening();
    this.playFirstMove()

    const chessBoardStateSubscription$ = this.chessBoardService.chessBoardState$.subscribe({
      next: (FEN: string) => {
        // If the game is over, clean up the subscription.
        if (this.chessBoard.isGameOver) {
          this.openingSubscriptions$.unsubscribe();
          return;
        }

        // Determine whose turn it is based on the FEN.
        const currentTurn: Color = FEN.split(" ")[1] === "w" ? Color.White : Color.Black;

        // Process only if it is the player's (tested side's) turn.
        if (currentTurn !== this.currentOpeningColor) return;

        // Get the player’s move. (Assume that the base ChessBoardComponent keeps track of the last move.)
        const playerMove = this.extractPlayerMove();
        
        if (!playerMove) return;

        // Compare the player's move with the expected move.
        if (this.checkMove(playerMove)) {
          console.log("Correct move!");
          // If the move is correct, let the opponent play the reply after a short delay.
          setTimeout(() => {
            this.playNextMove();
            return;
          }, 500);
        } else {
          console.log("Incorrect move! Restarting opening quiz...");
          // If the move is wrong, restart the opening quiz.
          setTimeout(() => {
            this.startNewOpening();
            return;
          }, 1000);
        }
      }
    });

    this.openingSubscriptions$.add(chessBoardStateSubscription$);
  }
  

  /**
   * Chooses a random opening from the imported data, sets the current opening moves
   * and resets the board.
   */
  private startNewOpening(): void {
    const openingNames = Object.keys(openings);
    const randomOpeningName = openingNames[Math.floor(Math.random() * openingNames.length)];
    const openingData = openings[randomOpeningName as keyof typeof openings];

    this.currentOpeningMoves = openingData.moves;
    this.currentOpeningColor = openingData.color;
    this.currentMoveIndex = 0;
    this.chessBoardService.resetBoard();
  }

  /**
   * Checks if the player's move matches the expected move from the opening data.
   * If the opening is for White, the expected move is in property 'w'; if for Black, it’s in 'b'.
   */
  private checkMove(playerMove: Move): boolean {
    if(!playerMove){
      console.log(playerMove)
    };
    const expectedMove: Move =
      this.currentOpeningColor === Color.White
        ? this.currentOpeningMoves[this.currentMoveIndex].b
        : this.currentOpeningMoves[this.currentMoveIndex].w;
        console.log('expected:',expectedMove,'player move:',playerMove)
    return (
      playerMove.prevX === expectedMove.prevX &&
      playerMove.prevY === expectedMove.prevY &&
      playerMove.newX === expectedMove.newX &&
      playerMove.newY === expectedMove.newY &&
      playerMove.promotedPiece === expectedMove.promotedPiece
    );
  }

  /**
   * Plays the opponent's move from the opening sequence.
   * If the quiz is testing White's moves (i.e. currentOpeningColor is White),
   * the opponent's reply is given by the 'b' property (and vice versa).
   */
  private playNextMove(): void {
    const openingStep = this.currentOpeningMoves[this.currentMoveIndex];
    console.log(openingStep)
    if (!openingStep) {
      this.startNewOpening();
      console.log("Opening sequence finished!");
      return;
    }
    // Determine the opponent's move.
    const opponentMove: Move = this.currentOpeningColor === Color.White ? openingStep.w : openingStep.b;
    this.updateBoard(opponentMove.prevX, opponentMove.prevY, opponentMove.newX, opponentMove.newY, opponentMove.promotedPiece);
    this.currentMoveIndex++;
  }

  private playFirstMove(): void {
    if(this.currentOpeningColor == Color.Black){
      this.updateBoard(this.currentOpeningMoves[0].w.prevX, this.currentOpeningMoves[0].w.prevY, this.currentOpeningMoves[0].w.newX, this.currentOpeningMoves[0].w.newY, this.currentOpeningMoves[0].w.promotedPiece);
      this.updateBoard(this.currentOpeningMoves[0].b.prevX, this.currentOpeningMoves[0].b.prevY, this.currentOpeningMoves[0].b.newX, this.currentOpeningMoves[0].b.newY, this.currentOpeningMoves[0].b.promotedPiece);  
      this.currentMoveIndex++;
    }
    if(this.currentOpeningColor == Color.White){
      this.updateBoard(this.currentOpeningMoves[0].w.prevX, this.currentOpeningMoves[0].w.prevY, this.currentOpeningMoves[0].w.newX, this.currentOpeningMoves[0].w.newY, this.currentOpeningMoves[0].w.promotedPiece);
    }
  }

  /**
   * Extracts the player's move.
   * For this example, we assume that the parent ChessBoardComponent holds a property `lastMove`
   * representing the last move made by the player. You must implement this extraction logic based on your chess logic.
   */
  private extractPlayerMove(): Move | null {
    if (!this.lastMove) {
      return null;
    }

    // Transform LastMove into Move
    const move: Move = {
      prevX: this.lastMove.prevX,
      prevY: this.lastMove.prevY,
      newX: this.lastMove.currX,    // map currX to newX
      newY: this.lastMove.currY,    // map currY to newY
      promotedPiece: null           // or derive from this.lastMove.moveType if needed
    };

    return move;
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.openingSubscriptions$.unsubscribe();
  }
}
