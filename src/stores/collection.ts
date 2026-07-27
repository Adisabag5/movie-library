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
    {
      name: 'movie-library-collection',
      // Versioning the stored shape. Without it, a future change to
      // MediaItem would deserialise old localStorage into objects the UI
      // does not expect — silently, because persisted state is never
      // type-checked at runtime.
      version: 1,
      // `migrate` is required, not optional: when the stored version does
      // not match, zustand *discards* the state unless a migrate function
      // handles it. Existing collections were written before versioning and
      // read as version 0, so without this line they would all vanish on
      // the next load. The shape is unchanged, so it passes through — add a
      // branch here when MediaItem actually changes.
      migrate: (persisted) => persisted as CollectionState,
    }
  )
);

export const useInCollection = (item: MediaItem) =>
  useCollection((state) => state.items.some((i) => mediaKey(i) === mediaKey(item)));
