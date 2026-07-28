import type { Genre } from './api';

  export interface Episode {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    episode_type: string;
    production_code: string;
    runtime: number | null;
    season_number: number;
    show_id: number;
    still_path: string | null;
  }

  export interface Season {
    air_date: string | null;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
    vote_average: number;
  }

  export interface Network {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }

  export interface Series {
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    id: number;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    first_air_date: string;
    name: string;
    vote_average: number;
    vote_count: number;
  }

  export interface SeriesDetails extends Omit<Series, 'genre_ids'> {
    created_by: {
      id: number;
      credit_id: string;
      name: string;
      gender: number;
      profile_path: string | null;
    }[];
    episode_run_time: number[];
    genres: Genre[];
    homepage: string;
    in_production: boolean;
    languages: string[];
    last_air_date: string | null;
    last_episode_to_air: Episode | null;
    next_episode_to_air: Episode | null;
    networks: Network[];
    number_of_episodes: number;
    number_of_seasons: number;
    production_companies: {
      id: number;
      logo_path: string | null;
      name: string;
      origin_country: string;
    }[];
    production_countries: { iso_3166_1: string; name: string }[];
    seasons: Season[];
    spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
    status: string;
    tagline: string;
    type: string;
  }
