import { Component, Input, inject } from '@angular/core';
import { Movie } from '../../../../core/models/movie.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoritesService } from '../../../../core/services/favorites.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css',
})
export class MovieCard {
  @Input({ required: true }) movie!: Movie;
  private favoritesService = inject(FavoritesService);

  toggleFavorite(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.favoritesService.toggleFavorite(this.movie);
  }

  isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.movie.id);
  }
}
