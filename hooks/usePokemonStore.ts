import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface BasicPokemonInfo {
  id: number;
  name: string;
  image: string;
  types: string[];
}

interface PokemonState {
  favorites: Record<number, BasicPokemonInfo>;
  compareQueue: BasicPokemonInfo[];

  toggleFavorite: (pokemon: BasicPokemonInfo) => void;
  isFavorite: (id: number) => boolean;

  addToCompare: (pokemon: BasicPokemonInfo) => void;
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;
}

export const usePokemonStore = create<PokemonState>()(
  persist(
    (set, get) => ({
      favorites: {},
      compareQueue: [],

      toggleFavorite: (pokemon) => {
        set((state) => {
          const newFavorites = { ...state.favorites };
          if (newFavorites[pokemon.id]) {
            delete newFavorites[pokemon.id];
          } else {
            newFavorites[pokemon.id] = pokemon;
          }
          return { favorites: newFavorites };
        });
      },

      isFavorite: (id) => {
        return !!get().favorites[id];
      },

      addToCompare: (pokemon) => {
        set((state) => {
          // to prevent duplicates
          if (state.compareQueue.find((p) => p.id === pokemon.id)) {
            return state;
          }
          // max queue is 2
          if (state.compareQueue.length >= 2) {
            return { compareQueue: [state.compareQueue[1], pokemon] };
          }
          return { compareQueue: [...state.compareQueue, pokemon] };
        });
      },

      removeFromCompare: (id) => {
        set((state) => ({
          compareQueue: state.compareQueue.filter((p) => p.id !== id),
        }));
      },

      clearCompare: () => {
        set({ compareQueue: [] });
      },
    }),
    {
      name: "pokemon-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
