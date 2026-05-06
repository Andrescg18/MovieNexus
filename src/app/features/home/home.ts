import { Component, OnInit, inject } from '@angular/core';
import { MovieService } from '../../core/services/movie.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private movieService = inject(MovieService);

  ngOnInit(): void {
    console.log('🎬 Home Inicializado. Cargando películas...');
    this.movieService.getTrendingMovies().subscribe({
      next: (movies) => {
        console.log('✅ ¡Éxito! Datos recibidos de TMDB:', movies);
      },
      error: (error) => {
        console.error('❌ Error al obtener películas:', error);
      }
    });
  }
}
