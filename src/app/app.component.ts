import { Component, HostBinding, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet, IonSpinner, Platform, IonFab, IonFabList, IonFabButton, IonIcon } from '@ionic/angular/standalone';

import { LocationService } from './core/services/location-service';
import { AppStateService } from './core/services/app-state-service';
import { SettingsService } from './core/services/settings';
import { LayoutSize, DEFAULT_SLOTS } from './core/models/dashboard.model';

import { addIcons } from 'ionicons';
import * as ionIcons from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [CommonModule, IonApp, IonRouterOutlet, IonFab, IonFabList, IonFabButton, IonIcon],
})
export class AppComponent {
  @HostBinding('class') activeTheme: string = 'theme-light';
  fabVisible: boolean = true;
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
        this.activeTheme = `theme-${state.settings.theme}`;
      });
    addIcons(ionIcons);
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    // Questo è il momento perfetto: l'hardware è pronto e i permessi sono verificabili
    this.locationSvc.startTracking();
    this.startFabAutoHideTimer();
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
