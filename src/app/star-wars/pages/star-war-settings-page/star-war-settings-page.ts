import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { StarWarSettings } from '../../components/star-war-settings/star-war-settings';
import { OpeningCrawlSong } from '../../services/opening-crawl.song';
import { Settings } from '../../types';

@Component({
  selector: 'app-star-war-settings-page',
  imports: [StarWarSettings],
  templateUrl: './star-war-settings-page.html',
  styleUrl: './star-war-settings-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarWarSettingsPage {
  private readonly openingCrawlSong = inject(OpeningCrawlSong);

  protected readonly data = signal<Settings>({
    openingCrawl: this.openingCrawlSong.getSettings(),
  });

  constructor() {
    effect(() => {
      this.openingCrawlSong.setSettings(this.data().openingCrawl);
    });
  }
}
