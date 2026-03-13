import { httpResource } from '@angular/common/http';
import { Film, Person, Planet, ResultsList } from '../types';

export async function fetchResource<T>(url: string, abortSignal?: AbortSignal | null): Promise<T>;
export async function fetchResource<T>(
  url: string | null,
  abortSignal?: AbortSignal | null,
): Promise<T | null>;

export async function fetchResource<T>(
  url: string | null,
  abortSignal: AbortSignal | null = null,
): Promise<T | null> {
  if (url === null) {
    return null;
  }

  const res = await fetch(url, { cache: 'force-cache', signal: abortSignal });

  return await res.json();
}

const entryPointURL = 'https://swapi.dev/api';

export interface ResultsListParams {
  readonly search?: string;
  readonly page?: string;
}

export function peopleListResource(params: () => ResultsListParams | undefined) {
  return httpResource<ResultsList<Person>>(() =>
    params()
      ? {
          url: `${entryPointURL}/people`,
          params: { ...params()! },
        }
      : undefined,
  );
}

export function personResource(id: () => string | undefined) {
  return httpResource<Person>(() =>
    id()
      ? {
          url: `${entryPointURL}/people/${id()!}`,
          cache: 'force-cache',
        }
      : undefined,
  );
}

export function filmsListResource(params: () => ResultsListParams | undefined) {
  return httpResource<ResultsList<Film>>(() =>
    params()
      ? {
          url: `${entryPointURL}/films`,
          params: { ...params()! },
        }
      : undefined,
  );
}

export function filmResource(id: () => string | undefined) {
  return httpResource<Film>(() =>
    id()
      ? {
          url: `${entryPointURL}/films/${id()!}`,
          cache: 'force-cache',
        }
      : undefined,
  );
}

export function planetsListResource(params: () => ResultsListParams | undefined) {
  return httpResource<ResultsList<Planet>>(() =>
    params()
      ? {
          url: `${entryPointURL}/planets`,
          params: { ...params()! },
        }
      : undefined,
  );
}

export function planetResource(id: () => string | undefined) {
  return httpResource<Planet>(() =>
    id()
      ? {
          url: `${entryPointURL}/planets/${id()!}`,
          cache: 'force-cache',
        }
      : undefined,
  );
}
