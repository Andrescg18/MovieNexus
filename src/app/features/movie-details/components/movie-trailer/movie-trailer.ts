import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../../../core/services/movie.service';
import { SafePipe } from '../../../../shared/pipes/safe.pipe';

@Component({
  selector: 'app-movie-trailer',
  standalone: true,
  imports: [CommonModule, SafePipe],
  templateUrl: './movie-trailer.html',
  styleUrl: './movie-trailer.css'
})
export class MovieTrailer implements OnInit {
  @Input({ required: true }) movieId!: string;
  private movieService = inject(MovieService);

  trailerUrl = signal<string | null>(null);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.movieService.getMovieVideos(this.movieId).subscribe({
      next: (videos) => {
        const trailer = videos.find(
          v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
        );
        if (trailer) {
          this.trailerUrl.set(`https://www.youtube.com/embed/${trailer.key}`);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('❌ Error al cargar trailer:', err);
        this.isLoading.set(false);
      }
    });
  }
}
