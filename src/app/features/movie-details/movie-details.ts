import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MovieService } from '../../core/services/movie.service';
import { Movie } from '../../core/models/movie.model';
import { Cast } from '../../core/models/cast.model';
import { Observable, forkJoin, switchMap, catchError, of, map, startWith } from 'rxjs';
import { CastCard } from './components/cast-card/cast-card';
import { MovieTrailer } from './components/movie-trailer/movie-trailer';
import { MovieComments } from './components/movie-comments/movie-comments';

interface PageState {
  data?: { movie: Movie; cast: Cast[] };
  error?: boolean;
}

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterModule, CastCard, MovieTrailer, MovieComments],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css'
})
export class MovieDetails implements OnInit {
  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);
  
  movieData$: Observable<PageState | null> = this.route.paramMap.pipe(
    switchMap(params => {
      const id = params.get('id');
      if (!id) return of({ error: true });
      
      return forkJoin({
        movie: this.movieService.getMovieById(id),
        cast: this.movieService.getMovieCredits(id)
      }).pipe(
        map(data => ({ data })),
        catchError(err => {
          console.error('Error cargando detalles de la película', err);
          return of({ error: true });
        }),
        startWith(null)
      );
    })
  );

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  scrollToTrailer() {
    if (typeof document !== 'undefined') {
      const element = document.querySelector('.trailer-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
}
