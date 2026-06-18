import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../core/services/favorites.service';
import { MovieCard } from '../home/components/movie-card/movie-card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MovieCard, RouterModule],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class Favorites {
  favoritesService = inject(FavoritesService);
  
  // Exponemos la signal directamente a la vista
  favorites = this.favoritesService.favorites;
}
