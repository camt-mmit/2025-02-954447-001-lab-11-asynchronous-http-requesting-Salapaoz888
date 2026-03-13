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
import { IsNumberPipe } from '../../pipes/is-number-pipe';
import { SearchUrlPipe } from '../../pipes/search-url-pipe';
import { Film, Person, Planet } from '../../types';

@Component({
  selector: 'app-planet-view',
  imports: [RouterLink, DatePipe, DecimalPipe, ExtractIdPipe, IsNumberPipe, SearchUrlPipe],
  templateUrl: './planet-view.html',
  styleUrl: './planet-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetView {
  readonly data = input.required<Planet>();
  readonly moduleRoute = input.required<ActivatedRoute>();

  protected readonly residentResourceKey = createManagedMetadataKey<
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

  protected readonly filmResourceKey = createManagedMetadataKey<
    Resource<Film | undefined>,
    FieldContext<string>
  >((ctx) => {
    const resource = httpResource<Film>(() => ctx()!.value());

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
          residents: this.data().residents,
          films: this.data().films,
        }) as const,
    ),
    (path) => {
      applyEach(path.residents, (eachPath) => {
        metadata(eachPath, this.residentResourceKey, (ctx) => ctx);
      });

      applyEach(path.films, (eachPath) => {
        metadata(eachPath, this.filmResourceKey, (ctx) => ctx);
      });
    },
  );
}
