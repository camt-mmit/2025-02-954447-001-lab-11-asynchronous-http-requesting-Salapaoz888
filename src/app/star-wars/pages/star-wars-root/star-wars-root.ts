import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MOUDLE_ROUTE } from '../../tokens';

@Component({
  selector: 'app-star-wars-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './star-wars-root.html',
  styleUrl: './star-wars-root.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MOUDLE_ROUTE,
      useFactory: () => inject(ActivatedRoute),
    },
  ],
})
export class StarWarsRoot {}
