import { ChangeDetectionStrategy, Component, linkedSignal, model } from '@angular/core';
import { FormField, form, submit } from '@angular/forms/signals';
import { Settings } from '../../types';

@Component({
  selector: 'app-star-war-settings',
  imports: [FormField],
  templateUrl: './star-war-settings.html',
  styleUrl: './star-war-settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarWarSettings {
  readonly data = model.required<Settings>();

  protected readonly form = form(linkedSignal(() => this.data()));

  protected async onSubmit(): Promise<void> {
    await submit(this.form, async (form) => this.data.set(form().value()));

    this.form().reset();
  }

  protected onReset(): void {
    this.form().reset(this.data());
  }
}
