import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Comment } from '../models/comment.model';
import { Observable, map } from 'rxjs';

// Interfaz interna para comunicarse con la API real del instructor
interface ApiComment {
  id?: number;
  appId: string;
  itemId: string;
  author: string;
  text: string;
  rating: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private http = inject(HttpClient);

  private API_URL = 'https://api-comentarios-gm6f.onrender.com/api/comments';
  private APP_ID = 'MovieNexus-AndresGuardia';

  /**
   * Obtiene los comentarios de una película y los mapea al modelo requerido por la guía.
   */
  getComments(movieId: number): Observable<Comment[]> {
    return this.http.get<ApiComment[]>(this.API_URL).pipe(
      map((apiComments: ApiComment[]) => {
        if (!Array.isArray(apiComments)) return [];
        const targetItemId = `movie-${movieId}`;
        return apiComments
          .filter(c => c && c.appId === this.APP_ID && c.itemId === targetItemId)
          .map(c => ({
            id: c.id ? String(c.id) : undefined,
            appId: c.appId || this.APP_ID,
            movieId: movieId,
            userName: c.author || 'Anónimo',
            rating: c.rating || 5,
            comment: c.text || '',
            createdAt: c.createdAt
          }));
      })
    );
  }

  /**
   * Envía un comentario a la API del instructor mapeando los campos requeridos por el servidor.
   */
  createComment(comment: Omit<Comment, 'id' | 'createdAt'>): Observable<Comment> {
    const apiPayload: Omit<ApiComment, 'id' | 'createdAt'> = {
      appId: this.APP_ID,
      itemId: `movie-${comment.movieId}`,
      author: comment.userName,
      text: comment.comment,
      rating: comment.rating
    };

    return this.http.post<ApiComment>(this.API_URL, apiPayload).pipe(
      map((created: ApiComment) => ({
        id: created.id ? String(created.id) : undefined,
        appId: created.appId || this.APP_ID,
        movieId: comment.movieId,
        userName: created.author || 'Anónimo',
        rating: created.rating || 5,
        comment: created.text || '',
        createdAt: created.createdAt
      }))
    );
  }
}
