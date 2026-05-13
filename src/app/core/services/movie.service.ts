import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Movie, MovieResponse } from '../models/movie.model';
import { Cast, CreditsResponse } from '../models/cast.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getTrendingMovies(): Observable<Movie[]> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/trending/movie/week?language=es-ES`)
      .pipe(
        map(response => response.results)
      );
  }

  getPopularMovies(): Observable<Movie[]> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/popular?language=es-ES`)
      .pipe(
        map(response => response.results)
      );
  }

  getMovieById(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/movie/${id}?language=es-ES`);
  }

  getMovieCredits(id: string): Observable<Cast[]> {
    return this.http.get<CreditsResponse>(`${this.apiUrl}/movie/${id}/credits?language=es-ES`)
      .pipe(
        map(response => response.cast)
      );
  }
}
