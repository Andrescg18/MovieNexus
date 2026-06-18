import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private platformId = inject(PLATFORM_ID);
  
  deferredPrompt = signal<any>(null);
  showInstallBanner = signal<boolean>(false);
  isIos = signal<boolean>(false);
  isStandalone = signal<boolean>(false);
  
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkStandalone();
      this.checkIos();

      // Listen for the beforeinstallprompt event
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent default mini-infobar
        e.preventDefault();
        // Save the event
        this.deferredPrompt.set(e);
        // Show the banner if not already closed in this session
        if (!sessionStorage.getItem('pwa_banner_dismissed') && !this.isStandalone()) {
          this.showInstallBanner.set(true);
        }
      });

      // Listen for appinstalled event
      window.addEventListener('appinstalled', () => {
        console.log('MovieNexus fue instalada con éxito!');
        this.deferredPrompt.set(null);
        this.showInstallBanner.set(false);
        this.isStandalone.set(true);
      });
    }
  }

  private checkStandalone() {
    const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
    const isStandaloneNav = (navigator as any).standalone === true;
    this.isStandalone.set(isStandaloneMedia || isStandaloneNav);
  }

  private checkIos() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    this.isIos.set(isIosDevice);
    
    // For iOS devices, if they are NOT standalone, we show the custom banner prompting them to add to homescreen.
    if (isIosDevice && !this.isStandalone()) {
      if (!sessionStorage.getItem('pwa_banner_dismissed')) {
        this.showInstallBanner.set(true);
      }
    }
  }

  async install() {
    const promptEvent = this.deferredPrompt();
    if (!promptEvent) return;

    // Show the install prompt
    promptEvent.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await promptEvent.userChoice;
    console.log(`Usuario respondió a la instalación: ${outcome}`);

    // We no longer need the prompt, clear it
    this.deferredPrompt.set(null);
    this.showInstallBanner.set(false);
  }

  dismissBanner() {
    this.showInstallBanner.set(false);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  }

  // Helper method to reset dismissal for testing or manual prompt
  resetDismissal() {
    sessionStorage.removeItem('pwa_banner_dismissed');
    if (this.deferredPrompt() || (this.isIos() && !this.isStandalone())) {
      this.showInstallBanner.set(true);
    } else {
      // In case we don't have event but want to show the guidance
      this.showInstallBanner.set(true);
    }
  }
}
