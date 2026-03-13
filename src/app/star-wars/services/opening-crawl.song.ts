import { APP_ID, DestroyRef, Injectable, inject } from '@angular/core';
import { OpeningCrawlSettings } from '../types';

const songUrlKeyName = 'opening-crawl-song-url';
const startingTimeKeyName = 'opening-crawl-song-starting-time';

@Injectable({
  providedIn: 'root',
})
export class OpeningCrawlSong {
  private songUrlKeyName = `${inject(APP_ID)}-${songUrlKeyName}`;
  private startingTimeKeyName = `${inject(APP_ID)}-${startingTimeKeyName}`;

  private readonly audio = (() => {
    const audio = new Audio();

    audio.preload = 'auto';

    return audio;
  })();

  constructor() {
    const abortController = new AbortController();

    addEventListener(
      'storage',
      (ev) => {
        if (ev.storageArea === localStorage && ev.key === this.songUrlKeyName) {
          this.setSongUrl(ev.newValue ?? '');
        }
      },
      { signal: abortController.signal },
    );

    inject(DestroyRef).onDestroy(() => abortController.abort());

    this.reload();
  }

  private setSongUrl(songUrl: string): void {
    if (this.audio.src !== songUrl) {
      this.audio.src = songUrl;
    }
  }

  getSettings(): OpeningCrawlSettings {
    const startingTime = parseFloat(localStorage.getItem(this.startingTimeKeyName) ?? '0');

    return {
      songUrl: localStorage.getItem(this.songUrlKeyName) ?? '',
      startingTime: Number.isNaN(startingTime) ? 0 : startingTime,
    } as const;
  }

  setSettings(data: OpeningCrawlSettings): void {
    localStorage.setItem(this.songUrlKeyName, data.songUrl);
    localStorage.setItem(this.startingTimeKeyName, `${data.startingTime}`);

    this.setSongUrl(data.songUrl);
  }

  reload(): void {
    this.audio.src = localStorage.getItem(this.songUrlKeyName) ?? '';
  }

  play(): void {
    if (this.audio.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA) {
      const startingTime = parseFloat(localStorage.getItem(this.startingTimeKeyName) ?? '0');

      this.audio.currentTime = Number.isNaN(startingTime) ? 0 : startingTime;
      this.audio.play();
    }
  }

  stop(): void {
    this.audio.pause();
  }
}
