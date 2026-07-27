// Shapes shared across more than one resource live here. `Genre` used to
// sit in series.ts while movie.ts imported it from there, which pointed the
// dependency the wrong way round — a movie does not depend on a series.
export interface Genre {
  id: number;
  name: string;
}

export interface Paginated<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
