import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-hero">
      <div class="skeleton-hero-bg skeleton-base"></div>
      <div class="skeleton-hero-content">
        <div class="skeleton-hero-title skeleton-base"></div>
        <div class="skeleton-hero-meta skeleton-base"></div>
        <div class="skeleton-hero-desc skeleton-base"></div>
        <div class="skeleton-hero-desc short skeleton-base"></div>
        <div class="skeleton-hero-buttons">
          <div class="skeleton-hero-btn skeleton-base"></div>
          <div class="skeleton-hero-btn skeleton-base"></div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './skeleton-hero.css'
})
export class SkeletonHero {}
