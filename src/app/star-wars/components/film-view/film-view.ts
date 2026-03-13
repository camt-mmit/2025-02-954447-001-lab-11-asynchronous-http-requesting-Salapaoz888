import { DatePipe, DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  Resource,
  effect,
  input,
  linkedSignal,
} from '@angular/core';
import {
  FieldContext,
  applyEach,
  createManagedMetadataKey,
  form,
  metadata,
} from '@angular/forms/signals';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ExtractIdPipe } from '../../pipes/extract-id-pipe';
import { SearchUrlPipe } from '../../pipes/search-url-pipe';
import { Film, Person, Planet } from '../../types';
import { OpeningCrawl } from '../opening-crawl/opening-crawl';

@Component({
  selector: 'app-film-view',
  imports: [RouterLink, DatePipe, DecimalPipe, ExtractIdPipe, OpeningCrawl, SearchUrlPipe],
  templateUrl: './film-view.html',
  styleUrl: './film-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmView {
  readonly data = input.required<Film>();
  readonly moduleRoute = input.required<ActivatedRoute>();

  protected readonly characterResourceKey = createManagedMetadataKey<
    Resource<Person | undefined>,
    FieldContext<string>
  >((ctx) => {
    const resource = httpResource<Person>(() => ctx()!.value());

    const guardEffectRef = effect((onCleanup) => {
      ctx()!.fieldTree();

      onCleanup(() => {
        guardEffectRef.destroy();
        resource.destroy();
      });
    });

    return resource.asReadonly();
  });

  protected readonly planetResourceKey = createManagedMetadataKey<
    Resource<Planet | undefined>,
    FieldContext<string>
  >((ctx) => {
    const resource = httpResource<Planet>(() => ctx()!.value());

    const guardEffectRef = effect((onCleanup) => {
      ctx()!.fieldTree();

      onCleanup(() => {
        guardEffectRef.destroy();
        resource.destroy();
      });
    });

    return resource.asReadonly();
  });

  protected readonly form = form(
    linkedSignal(
      () =>
        ({
          characters: this.data().characters,
          planets: this.data().planets,
        }) as const,
    ),
    (path) => {
      applyEach(path.characters, (eachPath) => {
        metadata(eachPath, this.characterResourceKey, (ctx) => ctx);
      });

      applyEach(path.planets, (eachPath) => {
        metadata(eachPath, this.planetResourceKey, (ctx) => ctx);
      });
    },
  );
}
