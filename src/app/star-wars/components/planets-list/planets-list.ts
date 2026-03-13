import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExtractIdPipe } from '../../pipes/extract-id-pipe';
import { Planet } from '../../types';

@Component({
  selector: 'app-planets-list',
  imports: [RouterLink, ExtractIdPipe],
  templateUrl: './planets-list.html',
  styleUrl: './planets-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetsList {
  readonly data = input.required<readonly Planet[]>();
}
