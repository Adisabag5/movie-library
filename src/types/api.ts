// Every TMDB list endpoint wraps its items in the same envelope,
// so one generic type covers movies, series, search results…
export interface Paginated<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
