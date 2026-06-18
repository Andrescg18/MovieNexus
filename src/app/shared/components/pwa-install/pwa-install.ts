import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwaService } from '../../../core/services/pwa.service';

@Component({
  selector: 'app-pwa-install',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pwa-install.html',
  styleUrl: './pwa-install.css'
})
export class PwaInstall {
  protected pwaService = inject(PwaService);
  
  // Controls whether the detailed platform guide modal is open
  showGuide = signal<boolean>(false);
  
  // Selected tab in the guide
  activeTab = signal<'pc' | 'android' | 'ios'>('pc');

  onInstall() {
    if (this.pwaService.deferredPrompt()) {
      this.pwaService.install();
    } else {
      this.openGuide();
    }
  }

  openGuide() {
    // Select the tab based on user device if possible
    if (this.pwaService.isIos()) {
      this.activeTab.set('ios');
    } else if (/android/i.test(navigator.userAgent)) {
      this.activeTab.set('android');
    } else {
      this.activeTab.set('pc');
    }
    this.showGuide.set(true);
  }

  closeGuide() {
    this.showGuide.set(false);
  }

  dismissBanner() {
    this.pwaService.dismissBanner();
  }
}
