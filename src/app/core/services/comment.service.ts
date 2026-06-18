import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Comment } from '../models/comment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private http = inject(HttpClient);

  // =========================================================
  // 👍 CONFIGURACIÓN PERSONALIZADA - ¡CAMBIA ESTOS VALORES!
  // =========================================================

  /** URL de la API suministrada por el instructor */
  private API_URL = 'https://api-comentarios-gm6f.onrender.com/api/comments';

  /**
   * Identificador de tu aplicación.
   * Usa una combinación de tu proyecto y tu nombre para no mezclar datos.
   * Ejemplo: 'MovieNexus-Camila' o 'TechStudio-Juan'
   */
  private APP_ID = 'MovieNexus-AndresGuardia';

  /**
   * Obtiene los comentarios de un ítem filtrados por tu AppID
   */
  /**
   * Obtiene los comentarios del ítem especificado filtrando por APP_ID.
   * La API del instructor espera los parámetros como query strings.
   */
  getComments(itemId: string): Observable<Comment[]> {
    const params = { appId: this.APP_ID, itemId };
    return this.http.get<Comment[]>(this.API_URL, { params });
  }

  /**
   * Publica un nuevo comentario en la API del instructor
   */
  /**
   * Publica un nuevo comentario. El servidor añade `id` y `createdAt`.
   * Se incluye `appId` para que el backend pueda asociar el comentario a tu app.
   */
  addComment(comment: Omit<Comment, 'id' | 'createdAt'>): Observable<Comment> {
    const payload = { ...comment, appId: this.APP_ID };
    return this.http.post<Comment>(this.API_URL, payload);
  }
}
