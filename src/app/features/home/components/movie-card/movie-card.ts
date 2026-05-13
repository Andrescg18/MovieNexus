import { Component, Input } from '@angular/core';
import { Movie } from '../../../../core/models/movie.model';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css',
})
export class MovieCard {
  @Input({ required: true }) movie!: Movie;
}
