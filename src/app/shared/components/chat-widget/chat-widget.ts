import { Component, ElementRef, ViewChild, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GeminiService } from '../../../core/services/gemini.service';
import { Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './chat-widget.html',
  styleUrl: './chat-widget.css'
})
export class ChatWidget {
  geminiService = inject(GeminiService);
  
  isOpen = false;
  userInput = '';

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor() {
    // Escuchar cambios en los mensajes para auto-desplazar al fondo
    effect(() => {
      this.geminiService.messages();
      setTimeout(() => this.scrollToBottom(), 50);
    });
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  async send(): Promise<void> {
    if (!this.userInput.trim() || this.geminiService.isGenerating()) return;
    
    const messageToSend = this.userInput;
    this.userInput = '';
    
    await this.geminiService.sendMessage(messageToSend);
  }

  clearChat(): void {
    this.geminiService.clearHistory();
  }

  scrollToBottom(): void {
    if (this.scrollContainer) {
      try {
        const element = this.scrollContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      } catch (err) {
        console.error('Error scrolling chat to bottom:', err);
      }
    }
  }

  getMovieImageUrl(path: string | null): string {
    return path ? `https://image.tmdb.org/t/p/w185${path}` : 'assets/favicon.ico';
  }

  formatMarkdown(text: string): string {
    if (!text) return '';
    
    // Escapar caracteres HTML básicos para prevenir XSS
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Reemplazar **negrita**
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Reemplazar *cursiva*
    escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Reemplazar saltos de línea
    escaped = escaped.replace(/\n/g, '<br>');

    return escaped;
  }
}
