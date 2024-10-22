import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface AudioState {
  playing: boolean;
  loading: boolean;
  error: ErrorEvent | null;
}

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private readonly _audio = new Audio();
  private _stateSubject = new Subject<AudioState>();
  state$: Observable<AudioState> = this._stateSubject.asObservable();

  constructor() {
    this._audio.addEventListener('loadeddata', () => this.onLoaded())
    this._audio.addEventListener('playing', () => this.onPlaying())
    this._audio.addEventListener('ended', () => this.onEnded())
    this._audio.addEventListener('error', (error) => this.onError(error))
  }

  load(src: string): void {
    if (src === this._audio.src) {
      return;
    }
    this._audio.src = src;
    this._audio.load();
    this.setState({ loading: true });
  }

  play(src?: string): void {
    if (src) {
      if (src === this._audio.src) {
        this._audio.play()
        return
      }
      this.load(src)
    }
    this._audio.play()
  }

  pause(): void {
    this._audio.pause();
  }

  private onLoaded() {

    this.setState({ loading: false });
  }

  private onPlaying() {
    this.setState({ playing: true });
  }

  private onEnded() {
    this.setState({ playing: false });
  }

  private onError(error: ErrorEvent) {
    console.error('Audio Error:', error);
    this.setState({ error });
  }

  private setState(newState: Partial<AudioState>) {
    this._stateSubject.next({ ...this.getState(), ...newState });
  }

  private getState(): AudioState {
    return {
      playing: this._audio.paused,
      loading: this._audio.readyState < this._audio.HAVE_CURRENT_DATA,
      error: null,
    };
  }
}
