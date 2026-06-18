import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/components/layout/header/header';
import { Footer } from './shared/components/layout/footer/footer';
import { PwaInstall } from './shared/components/pwa-install/pwa-install';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, PwaInstall],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('MovieNexus');
}
