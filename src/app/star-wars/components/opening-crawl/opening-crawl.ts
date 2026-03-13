import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { OpeningCrawlSong } from '../../services/opening-crawl.song';

const romans = [
  '',
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
  'XIII',
  'XIV',
  'XV',
  'XVI',
  'XVII',
  'XVIII',
  'XIX',
  'XX',
] as const;

const stages = ['intro', 'crawl'] as const;

@Component({
  selector: 'app-opening-crawl',
  imports: [],
  templateUrl: './opening-crawl.html',
  styleUrl: './opening-crawl.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--_height]': 'height()',
    '[style.--_width]': 'width()',
    '[style.--_crawl-height]': 'crawlHeight()',
  },
})
export class OpeningCrawl {
  readonly episode = input.required<number>();
  readonly title = input.required<string>();
  readonly crawl = input.required<string>();

  protected readonly height = signal('0px');
  protected readonly width = signal('0px');

  protected readonly hasBeenActive = signal(navigator.userActivation.hasBeenActive);

  protected readonly episodeRoman = computed(() => romans[this.episode()]);

  protected readonly crawlParagraphs = computed(() =>
    this.crawl()
      .split(/\r\n\r\n/g)
      .map((paragraph) => paragraph.split(/\r\n/g)),
  );

  protected readonly crawlHeight = signal('0px');

  protected readonly stage = signal<(typeof stages)[number]>(stages[0]);

  private readonly crawlElementRef = viewChild<unknown, ElementRef<HTMLElement>>('content', {
    read: ElementRef,
  });

  private readonly openingCrawlSong = inject(OpeningCrawlSong);

  constructor() {
    const hostElementRef = inject<ElementRef<Element>>(ElementRef);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hostElementRef.nativeElement) {
          const boundingClientRect = hostElementRef.nativeElement.getBoundingClientRect();

          this.height.set(`${boundingClientRect.height}px`);
          this.width.set(`${boundingClientRect.width}px`);
        }

        if (entry.target === this.crawlElementRef()?.nativeElement) {
          const crawlElementRef = this.crawlElementRef()!;

          this.crawlHeight.set(`${crawlElementRef.nativeElement.offsetHeight}px`);
        }
      }
    });

    resizeObserver.observe(hostElementRef.nativeElement);

    let oldCrawlElement: Element | null = null;

    afterRenderEffect({
      read: () => {
        if (oldCrawlElement) {
          resizeObserver.unobserve(oldCrawlElement);
        }

        const crawlElementRef = this.crawlElementRef();

        if (crawlElementRef) {
          oldCrawlElement = crawlElementRef.nativeElement;
          resizeObserver.observe(oldCrawlElement);
        }
      },
    });

    inject(DestroyRef).onDestroy(() => {
      resizeObserver.disconnect();
      this.openingCrawlSong.stop();
    });
  }

  protected onAnimationend(): void {
    const index = (stages.findIndex((stage) => stage === this.stage()) + 1) % stages.length;
    this.stage.set(stages[index]);

    if (stages[index] === 'crawl') {
      this.openingCrawlSong.play();
    } else {
      this.openingCrawlSong.stop();
    }
  }

  private readonly hostElement = inject<ElementRef<Element>>(ElementRef).nativeElement;

  protected fullscreen(): void {
    this.hostElement.requestFullscreen();
  }
}
