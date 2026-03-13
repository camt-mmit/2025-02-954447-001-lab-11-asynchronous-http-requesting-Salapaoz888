import { Pipe, PipeTransform } from '@angular/core';

const searchUrl = 'https://www.google.com/search';

@Pipe({
  name: 'searchUrl',
})
export class SearchUrlPipe implements PipeTransform {
  transform(value: string): string {
    const url = new URL(searchUrl);

    url.searchParams.set('q', `${value} (Star Wars)`);

    return url.toString();
  }
}
