import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Movie, MovieResponse } from '../models/movie.model';

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
}
