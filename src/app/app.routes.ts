import { Routes } from '@angular/router';
import { Home } from './features/home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { 
    path: 'movie/:id', 
    loadComponent: () => import('./features/movie-details/movie-details').then(m => m.MovieDetails) 
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/favorites').then(m => m.Favorites)
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound)
  }
];
