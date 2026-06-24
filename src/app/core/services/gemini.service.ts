import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MovieService } from './movie.service';
import { Movie } from '../models/movie.model';
import { firstValueFrom } from 'rxjs';

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  recommendations?: Movie[];
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private http = inject(HttpClient);
  private movieService = inject(MovieService);

  messages = signal<ChatMessage[]>([
    {
      role: 'assistant',
      text: '¡Hola! Soy **Nexus AI**, tu asistente cinéfilo personal. ¿Qué tipo de película te apetece ver hoy o sobre cuál te gustaría charlar? 🎬',
      timestamp: new Date()
    }
  ]);

  isGenerating = signal<boolean>(false);

  async sendMessage(text: string): Promise<void> {
    if (!text.trim()) return;

    // 1. Agregar mensaje del usuario al historial
    const userMsg: ChatMessage = {
      role: 'user',
      text: text.trim(),
      timestamp: new Date()
    };
    this.messages.update(prev => [...prev, userMsg]);

    this.isGenerating.set(true);

    try {
      // 2. Mapear historial al formato esperado por el backend
      const payload = {
        messages: this.messages().map(m => ({
          role: m.role,
          text: m.text
        }))
      };

      // 3. Llamar al proxy API backend
      const response = await firstValueFrom(
        this.http.post<{ message: string; recommendedMovieTitles: string[] }>('/api/chat', payload)
      );

      // 4. Buscar las recomendaciones de películas en TMDB si existen
      const recommendations: Movie[] = [];
      if (response.recommendedMovieTitles && response.recommendedMovieTitles.length > 0) {
        const searchPromises = response.recommendedMovieTitles.map(async (title) => {
          try {
            const results = await firstValueFrom(this.movieService.searchMovies(title));
            if (results && results.length > 0) {
              return results[0]; // tomar el primer resultado que coincide
            }
          } catch (searchErr) {
            console.error(`Error buscando película "${title}" en TMDB:`, searchErr);
          }
          return null;
        });

        const searchResults = await Promise.all(searchPromises);
        searchResults.forEach(m => {
          if (m) recommendations.push(m);
        });
      }

      // 5. Agregar respuesta de la IA
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        text: response.message,
        timestamp: new Date(),
        recommendations: recommendations.length > 0 ? recommendations : undefined
      };
      this.messages.update(prev => [...prev, assistantMsg]);

    } catch (err) {
      console.error('Error de comunicación con Nexus AI:', err);
      const errorMsg: ChatMessage = {
        role: 'assistant',
        text: 'Lo siento, he tenido un problema de conexión con mi proyector central de películas. Por favor, vuelve a intentarlo en un momento. 🔌',
        timestamp: new Date()
      };
      this.messages.update(prev => [...prev, errorMsg]);
    } finally {
      this.isGenerating.set(false);
    }
  }

  clearHistory(): void {
    this.messages.set([
      {
        role: 'assistant',
        text: '¡Historial de conversación reiniciado! ¿En qué aventura cinematográfica nos sumergimos ahora? 🍿',
        timestamp: new Date()
      }
    ]);
  }
}
