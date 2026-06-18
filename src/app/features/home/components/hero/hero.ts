import { Component, Input } from '@angular/core';
import { Movie } from '../../../../core/models/movie.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  @Input({ required: true }) movie!: Movie;

  get backdropUrl(): string {
    return `url(https://image.tmdb.org/t/p/original${this.movie.backdrop_path})`;
  }
}
