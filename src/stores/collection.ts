import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mediaKey, type MediaItem } from '../core/media';

// Client state, not server state: the collection belongs to the user
// and lives on their device — so it goes in a store (Zustand), not in
// TanStack Query, which manages caches of *server-owned* data.
interface CollectionState {
  items: MediaItem[];
  toggle: (item: MediaItem) => void;
}

export const useCollection = create<CollectionState>()(
  // persist writes every change to localStorage and rehydrates it on
  // startup, so the collection survives reloads and browser restarts.
  persist(
    (set) => ({
      items: [],

      toggle: (item) =>
        set((state) => {
          const exists = state.items.some((i) => mediaKey(i) === mediaKey(item));
          return {
            items: exists
              ? state.items.filter((i) => mediaKey(i) !== mediaKey(item))
              : [...state.items, item],
          };
        }),
    }),
    { name: 'movie-library-collection' } // the localStorage key
  )
);

// Selector hook: components using this only re-render when *this
// item's* membership changes, not on every collection change.
export const useInCollection = (item: MediaItem) =>
  useCollection((state) => state.items.some((i) => mediaKey(i) === mediaKey(item)));
