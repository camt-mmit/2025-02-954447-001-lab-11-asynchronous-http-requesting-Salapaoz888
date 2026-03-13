import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExtractIdPipe } from '../../pipes/extract-id-pipe';
import { Film } from '../../types';

@Component({
  selector: 'app-films-list',
  imports: [RouterLink, ExtractIdPipe],
  templateUrl: './films-list.html',
  styleUrl: './films-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmsList {
  readonly data = input.required<readonly Film[]>();
}
