import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  Resource,
  computed,
  effect,
  input,
  linkedSignal,
  resource,
} from '@angular/core';
import {
  FieldContext,
  applyEach,
  createManagedMetadataKey,
  form,
  metadata,
} from '@angular/forms/signals';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { fetchResource } from '../../helpers';
import { ExtractIdPipe } from '../../pipes/extract-id-pipe';
import { IsNumberPipe } from '../../pipes/is-number-pipe';
import { SearchUrlPipe } from '../../pipes/search-url-pipe';
import { Film, Person, Planet } from '../../types';

@Component({
  selector: 'app-person-view',
  imports: [
    RouterLink,
    AsyncPipe,
    DatePipe,
    DecimalPipe,
    ExtractIdPipe,
    IsNumberPipe,
    SearchUrlPipe,
  ],
  templateUrl: './person-view.html',
  styleUrl: './person-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonView {
  readonly data = input.required<Person>();
  readonly moduleRoute = input.required<ActivatedRoute>();

  protected readonly asyncData = computed(() => {
    const { homeworld, films } = this.data();

    return {
      homeworld$: fetchResource<Planet>(homeworld),
      films: films.map((url) => fetchResource<Film>(url)),
    } as const;
  });

  protected readonly homeworldResource = httpResource<Planet>(() =>
    this.data().homeworld
      ? {
          url: this.data().homeworld!,
          cache: 'force-cache',
        }
      : undefined,
  ).asReadonly();

  protected readonly filmsResource = resource({
    params: () => this.data().films,
    loader: async ({ params, abortSignal }) =>
      await Promise.all(params.map(async (url) => await fetchResource<Film>(url, abortSignal))),
  }).asReadonly();

  protected readonly filmResourceKey = createManagedMetadataKey<
    Resource<Film | undefined>,
    FieldContext<string>
  >((ctx) => {
    const resource = httpResource<Film>(() => ({
      url: ctx()!.value(),
      cache: 'force-cache',
    }));

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
          films: this.data().films,
        }) as const,
    ),
    (path) => {
      applyEach(path.films, (eachPath) => {
        metadata(eachPath, this.filmResourceKey, (ctx) => ctx);
      });
    },
  );
}
