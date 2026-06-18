import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../../../core/services/comment.service';
import { Comment } from '../../../../core/models/comment.model';

@Component({
  selector: 'app-movie-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-comments.html',
  styleUrl: './movie-comments.css'
})
export class MovieComments implements OnInit {
  @Input() movieId!: string;

  private commentService = inject(CommentService);

  comments: Comment[] = [];
  isFormOpen = false;
  isSubmitting = false;
  isLoading = true;

  // Formulario
  authorName = '';
  commentText = '';
  selectedRating = 5;

  stars = [1, 2, 3, 4, 5];

  get charCount(): number {
    return this.commentText.length;
  }

  get isFormValid(): boolean {
    return this.authorName.trim().length > 0 &&
           this.commentText.trim().length > 0 &&
           this.selectedRating >= 1 &&
           this.selectedRating <= 5;
  }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.isLoading = true;
    const itemId = `movie-${this.movieId}`;
    this.commentService.getComments(itemId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando comentarios', err);
        this.comments = [];
        this.isLoading = false;
      }
    });
  }

  toggleForm(): void {
    this.isFormOpen = !this.isFormOpen;
    if (!this.isFormOpen) {
      this.resetForm();
    }
  }

  setRating(rating: number): void {
    this.selectedRating = rating;
  }

  submitComment(): void {
    if (!this.isFormValid || this.isSubmitting) return;

    this.isSubmitting = true;

    const newComment: Omit<Comment, 'id' | 'createdAt'> = {
      appId: 'MovieNexus-AndresGuardia',
      itemId: `movie-${this.movieId}`,
      author: this.authorName.trim(),
      text: this.commentText.trim(),
      rating: this.selectedRating,
    };

    this.commentService.addComment(newComment).subscribe({
      next: (created) => {
        this.comments.unshift(created);
        this.resetForm();
        this.isFormOpen = false;
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Error publicando comentario', err);
        this.isSubmitting = false;
      }
    });
  }

  private resetForm(): void {
    this.authorName = '';
    this.commentText = '';
    this.selectedRating = 5;
  }

  getTimeAgo(dateStr: string | undefined): string {
    if (!dateStr) return '';
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Justo ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
