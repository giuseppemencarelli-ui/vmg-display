import { Component, HostBinding, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet, IonSpinner, Platform, IonFab, IonFabList, IonFabButton, IonIcon } from '@ionic/angular/standalone';

import { LocationService } from './core/services/location-service';
import { AppStateService } from './core/services/app-state-service';
import { SettingsService } from './core/services/settings';
import { LayoutSize, DEFAULT_SLOTS } from './core/models/dashboard.model';
import { StatusBarComponent } from './components/status-bar/status-bar.component';

import { addIcons } from 'ionicons';
import * as ionIcons from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [CommonModule, IonApp, IonRouterOutlet, IonFab, IonFabList, IonFabButton, IonIcon, StatusBarComponent],
})
export class AppComponent {
  @HostBinding('class') activeTheme: string = 'theme-device';
  @HostBinding('style.--app-font-family') activeFont: string = 'Orbitron';
  fabVisible: boolean = true;
  fabSide: 'top' | 'start' = 'top'; // top per portrait, start (left) per landscape
  private fabHideTimer: any;

  get currentLayoutSize(): LayoutSize {
    return this.settingsSvc.currentSettings.dashboardConfig.layout;
  }

  constructor(
    private platform: Platform,
    private router: Router,
    private locationSvc: LocationService,
    private appState: AppStateService,
    private settingsSvc: SettingsService
  ) {
      this.appState.state$.subscribe(state => {
        console.log('AppComponent - State cambio:', { theme: state.settings.theme, fontFamily: state.settings.fontFamily });
        this.activeTheme = `theme-${state.settings.theme}`;
        this.activeFont = state.settings.fontFamily;
        console.log('AppComponent - activeFont aggiornato a:', this.activeFont);
      });
    addIcons(ionIcons);
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    // Questo è il momento perfetto: l'hardware è pronto e i permessi sono verificabili
    this.locationSvc.startTracking();
    this.startFabAutoHideTimer();
    this.setupOrientationListener();
  }

  private setupOrientationListener(): void {
    // Rilevamento orientamento
    const mediaQuery = window.matchMedia('(orientation: landscape)');
    
    // Imposta il side iniziale
    this.updateFabSide(mediaQuery.matches);
    
    // Ascolta i cambiamenti di orientamento
    mediaQuery.addEventListener('change', (e) => {
      this.updateFabSide(e.matches);
    });
  }

  private updateFabSide(isLandscape: boolean): void {
    // In landscape: apri a sinistra (start)
    // In portrait: apri verso l'alto (top)
    this.fabSide = isLandscape ? 'start' : 'top';
  }

  @HostListener('document:click')
  onScreenTap() {
    if (!this.fabVisible) {
      this.fabVisible = true;
      this.startFabAutoHideTimer();
    } else {
      this.resetFabTimer();
    }
  }

  private startFabAutoHideTimer() {
    this.resetFabTimer();
    this.fabHideTimer = setTimeout(() => {
      this.fabVisible = false;
    }, 3000);
  }

  private resetFabTimer() {
    if (this.fabHideTimer) {
      clearTimeout(this.fabHideTimer);
    }
  }

  goTo(path: string) {
    this.router.navigate([path]);
    this.resetFabTimer();
  }

  setLayoutSize(size: LayoutSize) {
    this.settingsSvc.update({
      dashboardConfig: {
        layout: size,
        slots: DEFAULT_SLOTS[size]
      }
    });
    this.startFabAutoHideTimer();
  }
}
