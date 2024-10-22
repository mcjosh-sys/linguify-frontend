import { Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Subject } from 'rxjs';
import { Media } from '../models/admin.models';
import { AdminService } from './admin.service';

function generateRandomId(length: number): number {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

@Injectable({
  providedIn: 'root',
})
export class MediaBucketService {
  audio$ = new BehaviorSubject<Media[]>([]);
  images$ = new BehaviorSubject<Media[]>([]);
  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string>('');
  uploadMedia$ = new Subject<{
    type: 'image' | 'audio';
    payload: Omit<Media, 'id'>;
  }>();

  private readonly _audio = signal<Media[]>([]);
  private readonly _images = signal<Media[]>([]);

  constructor(private adminService: AdminService) {
    this.loading$.next(true);
    this.adminService
      .getMedia()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data: any) => {
          const audio = (data as Media[]).filter(
            (item) => item.type === 'AUDIO'
          );
          const images = (data as Media[]).filter(
            (item) => item.type === 'IMAGE'
          );
          this._audio.set(audio);
          this._images.set(images);
          this.audio$.next(audio);
          this.images$.next(images);
          this.loading$.next(false);
        },
        error: (err: any) => {
          console.log(err.message);
          this.error$.next(err.message);
        },
      });
  }

  getMedia(type: 'image' | 'audio', src: string) {
    if (type === 'image') {
      return this._images().find((image) => image.src === src);
    }
    return this._audio().find((audio) => audio.src === src);
  }

  filter(type: 'image' | 'audio', text: string) {
    if (type === 'image') {
      const filteredImages = this._images().filter((img) =>
        img.name.toLocaleLowerCase().includes(text.toLocaleLowerCase())
      );
      this.images$.next(filteredImages);
    } else {
      const filteredAudio = this._audio().filter((aud) =>
        aud.name.toLocaleLowerCase().includes(text.toLocaleLowerCase())
      );
      this.audio$.next(filteredAudio);
    }
  }

  uploadMedia(type: 'image' | 'audio', payload: Omit<Media, 'id'>) {
    this.adminService.postMedia(payload).subscribe({
      next: () => {
        if (type === 'image') {
          this._images.set([
            { id: generateRandomId(10), ...payload },
            ...this._images(),
          ]);
          this.images$.next(this._images());
        } else {
          this._audio.set([
            { id: generateRandomId(10), ...payload },
            ...this._audio(),
          ]);
          this.audio$.next(this._audio());
        }
      },
    });
  }
}
