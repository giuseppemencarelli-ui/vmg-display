import { Component, inject, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { AppStateService } from '../../core/services/app-state-service';
import { Status } from '../../core/models/status.model';
import { map, Observable, Subject, interval, switchMap } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { locationOutline, locationSharp, swapVerticalOutline, batteryChargingOutline, bluetoothOutline } from 'ionicons/icons';

@Component({
  selector: 'app-status-bar',
  templateUrl: 'status-bar.component.html',
  styleUrls: ['status-bar.component.scss'],
  imports: [CommonModule, IonIcon],
  standalone: true
})
export class StatusBarComponent implements OnInit, OnDestroy {
  private appStateSvc = inject(AppStateService);
  private destroy$ = new Subject<void>();

  // Stato della statusbar
  isExpanded: boolean = false;
  private expandTimer: any;

  // Observables
  status$: Observable<Status> = this.appStateSvc.state$.pipe(
    map(state => {
      //console.log('StatusBar - State ricevuto:', state);
      //console.log('StatusBar - Status:', state?.status);
      return state?.status;
    })
  );

  currentTime$: Observable<string> = this.appStateSvc.state$.pipe(
    switchMap(state => {
      const timeFormat = state.settings.timeFormat;
      const showSeconds = state.settings.showSeconds;
      
      return interval(1000).pipe(
        map(() => this.formatCurrentTime(timeFormat, showSeconds))
      );
    })
  );

  constructor() {
    addIcons({ locationOutline, locationSharp, swapVerticalOutline, batteryChargingOutline, bluetoothOutline });
  }

  ngOnInit(): void {
    //console.log('StatusBar - Component inizializzato');
    // Sottoscrivi ai cambiamenti dello stato
    this.status$.pipe(takeUntil(this.destroy$)).subscribe(status => {
      //console.log('StatusBar - Status sottoscritto:', status);
      // Se lo stato cambia mentre è espanso, resetta il timer
      if (this.isExpanded) {
        this.resetExpandTimer();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.expandTimer) {
      clearTimeout(this.expandTimer);
    }
  }

  /**
   * Click sulla statusbar: espandi
   */
  onStatusBarClick(): void {
    this.isExpanded = true;
    this.resetExpandTimer();
  }

  /**
   * Reset e avvia il timer di auto-collapse (3 secondi come il FAB)
   */
  private resetExpandTimer(): void {
    if (this.expandTimer) {
      clearTimeout(this.expandTimer);
    }
    this.expandTimer = setTimeout(() => {
      this.isExpanded = false;
    }, 3000);
  }

  /**
   * Determina l'icona GPS basata sulla disponibilità del fix
   */
  getGpsIcon(gps: any): string {
    if (gps?.hasFix) {
      return 'location-sharp';
    }
    return 'location-outline';
  }


  /**
   * Formatta l'ora corrente in base al formato e alle impostazioni
   */
  private formatCurrentTime(timeFormat: 'local' | 'utc', showSeconds: boolean): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      ...(showSeconds && { second: '2-digit' }),
      timeZone: timeFormat === 'utc' ? 'UTC' : undefined
    };

    return now.toLocaleTimeString('it-IT', options) + (timeFormat === 'utc' ? ' UTC' : '');
  }
  /**
   * Classe CSS per l'icona GPS
   */
  getGpsClass(gps: any): string {
    if (!gps?.enabled) {
      return 'icon-disabled';
    }
    if (gps?.hasFix) {
      return 'icon-active';
    }
    return 'icon-searching';
  }

  /**
   * Classe CSS per NMEA
   */
  getNmeaClass(nmea: any): string {
    if (!nmea?.enabled) {
      return 'icon-disabled';
    }
    if (nmea?.isConnected) {
      return 'icon-active';
    }
    return 'icon-inactive';
  }

  /**
   * Classe CSS per Wearables
   */
  getWearablesClass(wearables: any): string {
    if (!wearables?.enabled) {
      return 'icon-disabled';
    }
    if (wearables?.isConnected) {
      return 'icon-active';
    }
    return 'icon-inactive';
  }

  /**
   * Tooltip per GPS
   */
  getGpsTooltip(gps: any): string {
    if (!gps?.enabled) return 'GPS disabilitato';
    if (gps?.hasFix) return `GPS fix (${gps.accuracy}m)`;
    return 'GPS ricerca...';
  }

  /**
   * Tooltip per NMEA
   */
  getNmeaTooltip(nmea: any): string {
    if (!nmea?.enabled) return 'NMEA non abilitato';
    if (nmea?.isConnected) return 'NMEA collegato';
    return 'NMEA disconnesso';
  }

  /**
   * Tooltip per Wearables
   */
  getWearablesTooltip(wearables: any): string {
    if (!wearables?.enabled) return 'Wearables non abilitato';
    if (wearables?.isConnected) return 'Wearable collegato';
    return 'Wearable disconnesso';
  }
}
