import {
  Challenge,
  ChallengeOption,
  UserSubscription,
} from '@/app/models/user.models';
import { AudioService } from '@/app/services/audio.service';
import { ChallengeService } from '@/app/services/challenge.service';
import { open as openHeartsModal } from '@/app/store/actions/hearts-modal.actions';
import { open as openPracticeModal } from '@/app/store/actions/practice-modal.actions';
import { HeartsModalState } from '@/app/store/reducers/hearts-modal.reducer';
import { PracticeModalState } from '@/app/store/reducers/practice-modal.reducer';
import { Component, DestroyRef, Input, input, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as confetti from 'canvas-confetti';
import { toast } from 'ngx-sonner';
import { BehaviorSubject } from 'rxjs';
import { ResultCardComponent } from '../result-card/result-card.component';
import { ChallengeComponent } from './challenge/challenge.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { QuestionBubbleComponent } from './question-bubble/question-bubble.component';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    HeaderComponent,
    QuestionBubbleComponent,
    ChallengeComponent,
    FooterComponent,
    ResultCardComponent,
  ],
  templateUrl: './quiz.component.html',
  host: {
    class: 'h-full flex flex-col',
  },
})
export class QuizComponent {
  initialLessonId = input<number>();
  userSubscription = input<UserSubscription>();
  _initialPercentage = signal<number | undefined>(undefined);

  hearts = signal<number>(0);
  percentage = signal<number>(0);
  challenges = signal<Challenge[]>([]);
  activeChallenge = signal<Challenge | null>(null);
  activeIndex$ = new BehaviorSubject<number>(0);
  activeIndex = toSignal(this.activeIndex$.asObservable());
  title = signal<string>('');
  options = signal<ChallengeOption[]>([]);

  selectedOption = signal<number | undefined>(undefined);
  status = signal<'correct' | 'wrong' | 'none'>('none');
  pending = signal<boolean>(false);

  constructor(
    private challengeService: ChallengeService,
    protected router: Router,
    private audioService: AudioService,
    private heartsStore: Store<HeartsModalState>,
    private practiceStore: Store<PracticeModalState>,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.activeIndex$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.updateChallenge(value);
      });
  }

  ngAfterViewInit() {
    if (this._initialPercentage() === 100) {
      this.openPracticeModal();
    }
  }

  openHeartsModal() {
    this.heartsStore.dispatch(openHeartsModal());
  }

  openPracticeModal() {
    this.practiceStore.dispatch(openPracticeModal());
  }
  launchConfetti() {
    this.audioService.load('/audio/finish.mp3');
    this.audioService.play();
    confetti.create(undefined, { resize: true })({
      particleCount: 500,
      spread: 100,
      origin: { y: 0.6 },
      gravity: 0.8,
    });
  }

  updateChallenge(value: number) {
    this.activeChallenge.set(this.challenges()?.[value]!);
    if (!this.activeChallenge()) {
      this.launchConfetti();
      return;
    }
    this.title.set(
      this.activeChallenge()?.type === 'ASSIST'
        ? 'Select the correct meaning'
        : this.activeChallenge()?.question!
    );
    this.options.set(this.activeChallenge()?.challengeOptions || []);
  }

  onSelect(id: number) {
    if (this.status() !== 'none') return;

    this.selectedOption.set(id);
  }

  onNext() {
    this.activeIndex$.next(this.activeIndex()! + 1);
  }

  onContinue() {
    if (!this.selectedOption()) return;

    if (this.status() === 'wrong') {
      this.status.set('none');
      this.selectedOption.set(undefined);
      return;
    }
    if (this.status() === 'correct') {
      this.onNext();
      this.status.set('none');
      this.selectedOption.set(undefined);
      return;
    }

    const correctOption = this.options().find((option) => option.correct);

    if (!correctOption) return;

    if (correctOption && correctOption.id === this.selectedOption()) {
      this.pending.set(true);
      this.challengeService
        .upsertChallengeProgress(
          this.activeChallenge()?.id!,
          this.initialLessonId()!
        )
        .subscribe({
          next: (data: any) => {
            if (data?.error === 'hearts') {
              this.openHeartsModal();
              return;
            }
            this.audioService.load('/audio/correct.wav');
            this.audioService.play();
            this.status.set('correct');
            this.percentage.set(
              this.percentage() + 100 / this.challenges().length
            );
            // this is a practice
            if (this._initialPercentage() === 100) {
              this.hearts.set(Math.min(this.hearts() + 1, 5));
            }
            this.pending.set(false);
          },
          error: (err: any) => {
            console.error(err);
            toast.error('Something went wrong. Please try again.');
            this.pending.set(false);
          },
        });
    } else {
      this.challengeService.reduceHeart(this.activeChallenge()?.id!).subscribe({
        next: (data: any) => {
          if (data?.error === 'hearts') {
            this.openHeartsModal();
            return;
          }

          this.audioService.load('/audio/incorrect.wav');
          this.audioService.play();
          this.status.set('wrong');
          if (!data?.error) {
            this.hearts.set(Math.max(this.hearts() - 1, 0));
          }
        },
        error: (err: any) => {
          console.error(err);
          toast.error('Something went wrong. Please try again.');
        },
      });
    }
  }

  ngOnChanges(change: any) {
    if (change.initialLessonChallenges) {
      const challenges = change.initialLessonChallenges
        .currentValue as Challenge[];
      const percentage = Math.round(
        (challenges.filter((challenge) => challenge?.completed).length /
          challenges.length) *
          100
      );
      if (percentage === 100) {
        this.openPracticeModal();
        this.percentage.set(0);
      }
    }
  }

  @Input()
  set initialHearts(hearts: number) {
    this.hearts.set(hearts);
  }

  @Input()
  set initialPercentage(percentage: number) {
    this.percentage.set(percentage === 100 ? 0 : percentage);
    this._initialPercentage.set(percentage);
  }

  @Input()
  set initialLessonChallenges(challenges: Challenge[]) {
    const uncompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    );
    this.activeIndex$.next(uncompletedIndex === -1 ? 0 : uncompletedIndex);
    this.challenges.set(challenges);
  }
}
