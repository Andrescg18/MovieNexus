import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'movienexus_favorites';

  // Signal reactiva para la lista de favoritos
  favorites = signal<Movie[]>([]);

  constructor() {
    this.loadFavorites();
  }

  private loadFavorites() {
    // Solo accedemos a localStorage si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        try {
          this.favorites.set(JSON.parse(saved));
        } catch (e) {
          console.error('Error al parsear favoritos de localStorage', e);
        }
      }
    }
  }

  toggleFavorite(movie: Movie) {
    const current = this.favorites();
    const index = current.findIndex(m => m.id === movie.id);
    
    let updated: Movie[];
    if (index >= 0) {
      // Si ya está, lo quitamos
      updated = current.filter(m => m.id !== movie.id);
    } else {
      // Si no está, lo añadimos
      updated = [...current, movie];
    }

    // Actualizamos la Signal (esto notificará a todos los componentes)
    this.favorites.set(updated);
    
    // Guardamos en LocalStorage
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    }
  }

  isFavorite(movieId: number): boolean {
    return this.favorites().some(m => m.id === movieId);
  }
}
