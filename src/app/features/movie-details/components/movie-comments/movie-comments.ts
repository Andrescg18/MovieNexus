import { Component, Input, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
  @Input() movieId!: string | number;

  private commentService = inject(CommentService);
  private cdr = inject(ChangeDetectorRef);

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
    this.cdr.markForCheck();
    
    this.commentService.getComments(Number(this.movieId)).subscribe({
      next: (comments: Comment[]) => {
        this.comments = comments;
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error cargando comentarios', err);
        this.comments = [];
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  toggleForm(): void {
    this.isFormOpen = !this.isFormOpen;
    if (!this.isFormOpen) {
      this.resetForm();
    }
    this.cdr.markForCheck();
  }

  setRating(rating: number): void {
    this.selectedRating = rating;
    this.cdr.markForCheck();
  }

  submitComment(): void {
    if (!this.isFormValid || this.isSubmitting) return;

    this.isSubmitting = true;
    this.cdr.markForCheck();

    const newComment: Omit<Comment, 'id' | 'createdAt'> = {
      appId: 'MovieNexus-AndresGuardia',
      movieId: Number(this.movieId),
      userName: this.authorName.trim(),
      comment: this.commentText.trim(),
      rating: this.selectedRating,
    };

    this.commentService.createComment(newComment).subscribe({
      next: (created: Comment) => {
        this.comments.unshift(created);
        this.resetForm();
        this.isFormOpen = false;
        this.isSubmitting = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error publicando comentario', err);
        this.isSubmitting = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  private resetForm(): void {
    this.authorName = '';
    this.commentText = '';
    this.selectedRating = 5;
    this.cdr.markForCheck();
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