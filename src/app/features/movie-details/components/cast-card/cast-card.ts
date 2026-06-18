import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cast } from '../../../../core/models/cast.model';

@Component({
  selector: 'app-cast-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cast-card.html',
  styleUrl: './cast-card.css'
})
export class CastCard {
  @Input({ required: true }) actor!: Cast;

  get profileUrl(): string {
    if (this.actor.profile_path) {
      return `https://image.tmdb.org/t/p/w185${this.actor.profile_path}`;
    }
    // Placeholder for actors without a profile picture
    return 'https://via.placeholder.com/185x278/222222/FFFFFF?text=No+Photo';
  }
}
