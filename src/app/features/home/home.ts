import { Component, inject, signal, OnInit, OnDestroy, ElementRef, ViewChild, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MovieService } from '../../core/services/movie.service';
import { Hero } from './components/hero/hero';
import { MovieCard } from './components/movie-card/movie-card';
import { SkeletonCard } from '../../shared/components/skeleton-card/skeleton-card';
import { SkeletonHero } from '../../shared/components/skeleton-hero/skeleton-hero';
import { Movie } from '../../core/models/movie.model';
import { CommonModule } from '@angular/common';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, MovieCard, SkeletonCard, SkeletonHero, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  private movieService = inject(MovieService);
  private platformId = inject(PLATFORM_ID);
  
  featuredMovie = signal<Movie | null>(null);
  trendingMovies = signal<Movie[]>([]);
  popularMovies = signal<Movie[]>([]);
  isLoading = signal<boolean>(false);
  currentPage = 1;

  private observer: IntersectionObserver | null = null;
  private sub: Subscription | null = null;

  // Usamos un setter para detectar dinámicamente cuando el ancla se renderiza tras resolverse el @if
  @ViewChild('scrollAnchor') set scrollAnchor(element: ElementRef) {
    if (element && isPlatformBrowser(this.platformId) && !this.observer) {
      this.initIntersectionObserver(element);
    }
  }

  ngOnInit(): void {
    this.isLoading.set(true);
    
    // Carga inicial coordinada con forkJoin
    this.sub = forkJoin({
      trending: this.movieService.getTrendingMovies(),
      popular: this.movieService.getPopularMovies(1)
    }).subscribe({
      next: ({ trending, popular }) => {
        if (trending.length > 0) {
          this.featuredMovie.set(trending[0]);
          this.trendingMovies.set(trending.slice(1));
        }
        this.popularMovies.set(popular);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('❌ Error al cargar datos iniciales de inicio:', err);
        this.isLoading.set(false);
      }
    });
  }

  private initIntersectionObserver(element: ElementRef) {
    const options = {
      root: null,
      rootMargin: '200px', // Activar carga 200px antes de llegar al final real
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isLoading()) {
          this.loadMoreMovies();
        }
      });
    }, options);

    this.observer.observe(element.nativeElement);
  }

  loadMoreMovies() {
    this.isLoading.set(true);
    this.currentPage++;
    
    this.movieService.getPopularMovies(this.currentPage).subscribe({
      next: (movies) => {
        if (movies && movies.length > 0) {
          // Concatenamos las películas usando el operador spread
          this.popularMovies.set([...this.popularMovies(), ...movies]);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('❌ Error al cargar más películas:', err);
        this.isLoading.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
