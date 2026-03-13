export interface OpeningCrawlSettings {
  readonly songUrl: string;
  readonly startingTime: number;
}

export interface Settings {
  readonly openingCrawl: OpeningCrawlSettings;
}
