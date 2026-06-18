import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Comment } from '../models/comment.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private http = inject(HttpClient);

  private API_URL = 'https://api-comentarios-gm6f.onrender.com/api/comments';
  private APP_ID = 'MovieNexus-AndresGuardia';

  /**
   * Obtiene los comentarios de un ítem filtrados por tu AppID y movieId en el cliente
   */
  getComments(movieId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.API_URL).pipe(
      map((comments: Comment[]) => 
        comments.filter(c => c.appId === this.APP_ID && Number(c.movieId) === movieId)
      )
    );
  }

  /**
   * Publica un nuevo comentario
   */
  createComment(comment: Omit<Comment, 'id' | 'createdAt'>): Observable<Comment> {
    const payload = { ...comment, appId: this.APP_ID };
    return this.http.post<Comment>(this.API_URL, payload);
  }
}
