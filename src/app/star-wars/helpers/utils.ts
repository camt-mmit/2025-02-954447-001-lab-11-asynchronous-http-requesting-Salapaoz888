export function asReadonly<T>(data: T[]): readonly T[] {
  return data;
}

export function extractId(url: string) {
  return (
    new URL(url).pathname
      .split('/')
      .reverse()
      .find((path) => path !== '') ?? null
  );
}

export function purnEmptyProperties<T extends object>(
  data: T,
): {
  [K in keyof T]?: NonNullable<T[K]>;
} {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => !!value)) as {
    [K in keyof T]?: NonNullable<T[K]>;
  };
}
