import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, delay } from 'rxjs';
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
        delay(1500), // Simular carga para apreciar Skeletons
        map(response => response.results)
      );
  }

  getPopularMovies(page: number = 1): Observable<Movie[]> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/popular?language=es-ES&page=${page}`)
      .pipe(
        delay(1500), // Simular carga para apreciar Skeletons
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

  searchMovies(query: string): Observable<Movie[]> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/search/movie?query=${query}&language=es-ES`)
      .pipe(
        map(response => response.results)
      );
  }

  getMovieVideos(id: string): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/movie/${id}/videos?language=es-ES`)
      .pipe(
        map(response => response.results)
      );
  }
}
