import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabList, IonFabButton, IonIcon, IonPopover, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AppStateService } from '../../core/services/app-state-service';
import { menuOutline } from 'ionicons/icons';
import { LayoutSize } from '../../core/models/dashboard.model';
import { MEASURANDS, Measurand } from '../../core/models/measurand.model';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    AsyncPipe,
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonFab, IonFabButton, IonIcon,
    IonPopover, IonList, IonItem, IonLabel
  ],
})
export class HomePage {
  private appStateSvc = inject(AppStateService);
  private router = inject(Router);
  readonly MEASURANDS = MEASURANDS;

  state$ = this.appStateSvc.state$;

  gridColumns$ = this.state$.pipe(
    map(state => {
      const layout = state?.settings?.dashboardConfig?.layout as LayoutSize;
      const layoutMap: Record<LayoutSize, number> = { 1: 1, 2: 2, 4: 2, 6: 3 };
      return layoutMap[layout] || 2;
    })
  );

  visibleSlots$ = this.state$.pipe(
    map(state => state?.settings?.dashboardConfig?.slots || [])
  );

  getMeasurandData(measurandId: string): Measurand | undefined {
    return MEASURANDS[measurandId as keyof typeof MEASURANDS];
  }

  getMeasurandValue(measurandId: string): string {
    // TODO: Implementare il collegamento con i dati NMEA reali
    // Per ora mostra valori di placeholder
    const placeholders: Record<string, string> = {
      sog: '6.4',
      cog: '247',
      wind_speed: '18',
      wind_angle: '35',
      depth: '12.4',
      destination_dist: '8.3',
      lat: '40° 42.3\' N',
      lon: '14° 28.7\' E',
      destination_eta: '2h 14m',
      hdg: '245',
      rpm: '1500',
      water_temp: '15.2'
    };
    return placeholders[measurandId] || '—';
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  goToOperativa() {
    this.router.navigate(['/operativa']);
  }
}
