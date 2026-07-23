import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mediaKey, type MediaItem } from '../core/media';

interface CollectionState {
  items: MediaItem[];
  toggle: (item: MediaItem) => void;
}

export const useCollection = create<CollectionState>()(
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
    { name: 'movie-library-collection' }
  )
);

export const useInCollection = (item: MediaItem) =>
  useCollection((state) => state.items.some((i) => mediaKey(i) === mediaKey(item)));
