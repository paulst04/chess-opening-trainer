import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ChessBoardComponent } from '../chess-board/chess-board.component';
import { OpeningKnowledgeService } from './opening-knowledge.service';
import { ChessBoardService } from '../chess-board/chess-board.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { Color } from 'src/app/chess-logic/models';
import { getOpeningColor, getRandomOpeningName } from './openings';

@Component({
  selector: 'app-opening-knowledge-mode',
  templateUrl: '../chess-board/chess-board.component.html',
  styleUrls: ['../chess-board/chess-board.component.css']
})
export class OpeningKnowledgeModeComponent extends ChessBoardComponent implements OnInit, OnDestroy {
  private computerSubscriptions$ = new Subscription();
  private currentOpeningIndex = 0;
  private currentOpening = "";
  private openingColor = Color.White;

  constructor(private openingKnowledgeService: OpeningKnowledgeService) {
    super(inject(ChessBoardService));
  }

  public override ngOnInit(): void {
    super.ngOnInit();
    this.currentOpening = getRandomOpeningName();
    this.openingColor = getOpeningColor(this.currentOpening);

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

        const player: Color = FEN.split(" ")[1] === "w" ? Color.White : Color.Black;
        if (player !== this.openingColor) return;
        if(this.currentOpeningIndex>5) return;

        const { prevX, prevY, newX, newY, promotedPiece } =await firstValueFrom(this.openingKnowledgeService.getBestMove(this.currentOpening, this.currentOpeningIndex, this.openingColor));
        this.updateBoard(prevX, prevY, newX, newY, promotedPiece);
        this.currentOpeningIndex++;
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
