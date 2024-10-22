import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const cats = ['courses', 'units', 'lessons', 'challenges', 'challenge-options'];

const urlSplitter = (url: string) => {
  return url.split('api/')[1];
};

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache = new Map<string, any>();
  public cache$ = new BehaviorSubject<any>(null);

  set(key: string, data: any): void {
    this.cache.set(key, data);
    this.cache$.next(this.cache.get(key)!);
  }

  get(key: string): any {
    const data = this.cache.get(key);
    this.cache$.next(data);
    return data;
  }

  clearCache(cat: 'courses' | 'units' | 'lessons' | 'challenges') {
    Array.from(this.cache, ([key, _]) => {
      if (
        cats.slice(cats.indexOf(cat), cats.length).includes(key.split('/')[0])
      ) {
        this.cache.delete(key);
        this.cache$.next(null);
      }
    })
  }

  invalidateCache(key: string | string[]): void {
    if (Array.isArray(key)) {
      key.forEach((k) => {
        this.cache.delete(urlSplitter(k));
        this.cache$.next(null);
      });
      return;
    }
    this.cache.delete(urlSplitter(key));
    this.cache$.next(null);
  }
}
