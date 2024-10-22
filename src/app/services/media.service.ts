import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private mediaQueryList!: MediaQueryList

  constructor() { }

  init(query: string): boolean{
    this.mediaQueryList = window.matchMedia(query)
    return this.mediaQueryList.matches
  }
  
  matches(): boolean { return this.mediaQueryList.matches }
  
  subscribe(callback: (matches: boolean) => void): MediaSubscription {
    const handler = (event: MediaQueryListEvent) => callback(event.matches)
    this.mediaQueryList.addEventListener("change", handler)
    return {
      unsubscribe: () => this.mediaQueryList.removeEventListener('change', handler)
    }
  }
}

export type MediaSubscription = {
  unsubscribe: () => void
}
