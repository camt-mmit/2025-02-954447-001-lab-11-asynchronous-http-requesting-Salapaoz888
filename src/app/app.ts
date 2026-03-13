import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class._full-page]': 'fullPage()',
  },
})
export class App {
  protected readonly title = signal('week-11');

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly fullPage = toSignal(
    this.router.events.pipe(
      filter((ev) => ev instanceof NavigationEnd),
      map(() => {
        let route = this.route.root;

        while (true) {
          if (route.snapshot.data['fullPage'] === true) {
            return true;
          }

          if (route.firstChild) {
            route = route.firstChild;
          } else {
            return false;
          }
        }
      }),
    ),
    { initialValue: true },
  );
}
