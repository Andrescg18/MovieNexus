import { Component, effect, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../../../core/services/movie.service';
import { Movie } from '../../../../core/models/movie.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private movieService = inject(MovieService);
  
  searchQuery = signal('');
  searchResults = signal<Movie[]>([]);

  constructor() {
    effect((onCleanup) => {
      const query = this.searchQuery();

      if (query.length < 3) {
        this.searchResults.set([]);
        return;
      }

      const timeout = setTimeout(() => {
        this.movieService.searchMovies(query).subscribe(movies => {
          this.searchResults.set(movies);
        });
      }, 300);

      onCleanup(() => clearTimeout(timeout));
    });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  clearSearch() {
    this.searchQuery.set('');
    this.searchResults.set([]);
  }
}
