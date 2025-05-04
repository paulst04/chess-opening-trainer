import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ChessBoardComponent } from '../chess-board/chess-board.component';
import { OpeningKnowledgeService } from './opening-knowledge.service';
import { ChessBoardService } from '../chess-board/chess-board.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { Color } from 'src/app/chess-logic/models';
import { getOpeningColor, getRandomOpeningName } from './openings';
import { chessOpeningStatus } from './models';

@Component({
  selector: 'app-opening-knowledge-mode',
  templateUrl: '../chess-board/chess-board.component.html',
  styleUrls: ['../chess-board/chess-board.component.css']
})
export class OpeningKnowledgeModeComponent extends ChessBoardComponent implements OnInit, OnDestroy {
  private computerSubscriptions$ = new Subscription();
  private openingStatus: chessOpeningStatus = {
    name: "",
    openingIndex: 0,
    color: Color.White
  };

  constructor(private openingKnowledgeService: OpeningKnowledgeService) {
    super(inject(ChessBoardService));
  }

  public override ngOnInit(): void {
    super.ngOnInit();
    this.openingStatus.name = getRandomOpeningName();
    this.openingStatus.color = getOpeningColor(this.openingStatus.name);

    // const computerConfiSubscription$: Subscription = this.openingKnowledgeService.computerConfiguration$.subscribe({
    //   next: (computerConfiguration) => {
    //     if (computerConfiguration.color === Color.White) this.flipBoard();
    //   }
    // });

    const chessBoardStateSubscription$: Subscription = this.chessBoardService.chessBoardState$.subscribe({
      next: async (FEN: string) => {
        if (this.chessBoard.isGameOver) {
          chessBoardStateSubscription$.unsubscribe();
          return;
        }

        console.log(this.openingStatus.openingIndex);

        // Check if opening is over (after move 2) and reset board
        if (this.openingStatus.openingIndex > 2) {
          window.location.reload()
           // Ensure we don’t continue execution
        }

        // Determine player from FEN
        const player: Color = FEN.split(" ")[1] === "w" ? Color.White : Color.Black;
        if (player !== this.openingStatus.color) return;

        // Fetch next move
        const { prevX, prevY, newX, newY, promotedPiece } = await firstValueFrom(
          this.openingKnowledgeService.getNextOpeningMove(this.openingStatus)
        );

        this.updateBoard(prevX, prevY, newX, newY, promotedPiece);
        this.openingStatus.openingIndex++;
      }
    });

    this.computerSubscriptions$.add(chessBoardStateSubscription$);
    // this.computerSubscriptions$.add(computerConfiSubscription$);
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.computerSubscriptions$.unsubscribe();
  }
}
