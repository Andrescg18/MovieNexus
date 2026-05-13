import { Component, OnInit, inject } from '@angular/core';
import { MovieService } from '../../core/services/movie.service';
import { Hero } from './components/hero/hero';
import { MovieCard } from './components/movie-card/movie-card';
import { Movie } from '../../core/models/movie.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, MovieCard, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private movieService = inject(MovieService);
  featuredMovie?: Movie;
  trendingMovies: Movie[] = [];
  popularMovies: Movie[] = [];


  ngOnInit(): void {
    console.log('🎬 Home Inicializado. Cargando películas...');
    this.movieService.getTrendingMovies().subscribe({
      next: (movies) => {
        console.log('✅ ¡Éxito! Datos recibidos de TMDB:', movies);
        if (movies.length > 0) {
          this.featuredMovie = movies[0];
          this.trendingMovies = movies.slice(1);
        }
      },
      error: (error) => {
        console.error('❌ Error al obtener películas:', error);
      }
    });

    this.movieService.getPopularMovies().subscribe({
      next: (movies) => {
        this.popularMovies = movies;
      },
      error: (error) => {
        console.error('❌ Error al obtener películas populares:', error);
      }
    });
  }
}
