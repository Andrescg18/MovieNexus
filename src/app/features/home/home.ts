import { Component, inject } from '@angular/core';
import { MovieService } from '../../core/services/movie.service';
import { Hero } from './components/hero/hero';
import { MovieCard } from './components/movie-card/movie-card';
import { Movie } from '../../core/models/movie.model';
import { CommonModule } from '@angular/common';
import { forkJoin, map, catchError, of, Observable } from 'rxjs';

interface HomeData {
  featured: Movie;
  trending: Movie[];
  popular: Movie[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, MovieCard, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private movieService = inject(MovieService);
  
  data$: Observable<HomeData | null> = forkJoin({
    trending: this.movieService.getTrendingMovies(),
    popular: this.movieService.getPopularMovies()
  }).pipe(
    map(({ trending, popular }) => {
      if (trending.length === 0) return null;
      return {
        featured: trending[0],
        trending: trending.slice(1),
        popular: popular
      };
    }),
    catchError(err => {
      console.error('❌ Error cargando datos de inicio:', err);
      return of(null);
    })
  );
}
