import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, IonLabel, IonInput, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SettingsService } from '../../core/services/settings';
import { AppStateService } from '../../core/services/app-state-service';
import { RouteMode, RouteSettings, DestinationPoint } from '../../core/models/settings.model';
import { arrowBackOutline, compassOutline, locationOutline, compass, location, navigateCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-setrotta',
  templateUrl: 'setrotta.page.html',
  styleUrls: ['setrotta.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonBackButton, IonButtons, IonLabel, IonInput, IonButton, IonIcon
  ],
})
export class SetrottaPage {
  private settingsSvc = inject(SettingsService);
  private appStateSvc = inject(AppStateService);
  private router = inject(Router);

  // Copia locale delle impostazioni di rotta
  routeSettings: RouteSettings = { ...this.settingsSvc.currentSettings.routeSettings };

  // Valori per il form
  bearingValue: number = this.routeSettings.bearing || 0;
  destinationLat: number = this.routeSettings.destination?.latitude || 0;
  destinationLon: number = this.routeSettings.destination?.longitude || 0;
  destinationName: string = this.routeSettings.destination?.name || '';

  // Getter per il bearing calcolato in tempo reale
  get calculatedBearing(): number | null {
    if (this.routeSettings.mode === 'destination' && this.destinationLat && this.destinationLon) {
      return this.calculateBearingToDestination();
    }
    return null;
  }

  constructor() {
    addIcons({
      arrowBackOutline,
      compassOutline,
      locationOutline,
      compass,
      location,
      navigateCircleOutline,
      checkmarkCircleOutline
    });
  }

  ionViewWillEnter() {
    // Ricarica le impostazioni quando la pagina viene visualizzata
    this.routeSettings = { ...this.settingsSvc.currentSettings.routeSettings };
    this.bearingValue = this.routeSettings.bearing || 0;
    this.destinationLat = this.routeSettings.destination?.latitude || 0;
    this.destinationLon = this.routeSettings.destination?.longitude || 0;
    this.destinationName = this.routeSettings.destination?.name || '';
  }

  onModeChange(mode: any) {
    this.routeSettings.mode = mode as RouteMode;
  }

  async onSave() {
    try {
      const currentSettings = this.settingsSvc.currentSettings;

      if (this.routeSettings.mode === 'bearing') {
        this.routeSettings.bearing = this.bearingValue;
        this.routeSettings.destination = undefined;
      } else {
        // Calcola il bearing dalla posizione corrente al punto di destinazione
        const bearing = this.calculateBearingToDestination();
        this.routeSettings.bearing = bearing;
        this.routeSettings.destination = {
          latitude: this.destinationLat,
          longitude: this.destinationLon,
          name: this.destinationName || undefined
        };
      }

      const updatedSettings = {
        ...currentSettings,
        routeSettings: this.routeSettings
      };

      await this.settingsSvc.update(updatedSettings);

      // Aggiorna anche il valore BRG nei measurands
      this.updateBearingMeasurand();

      this.router.navigate(['/home']);
    } catch (err) {
      console.error('Errore salvataggio rotta', err);
    }
  }

  private calculateBearingToDestination(): number {
    // Ottiene la posizione corrente
    const currentState = this.appStateSvc.getCurrentState();
    const currentPosition = currentState?.measurands?.pos?.value;
    if (!currentPosition) {
      return 0; // Default se non c'è posizione
    }

    // Parsing della posizione corrente (formato: "lat $ lon")
    const [currentLatStr, currentLonStr] = currentPosition.split(' $ ');
    const currentLat = parseFloat(currentLatStr);
    const currentLon = parseFloat(currentLonStr);

    if (isNaN(currentLat) || isNaN(currentLon)) {
      return 0;
    }

    // Calcola il bearing usando la formula del bearing iniziale
    const dLon = (this.destinationLon - currentLon) * Math.PI / 180;
    const lat1 = currentLat * Math.PI / 180;
    const lat2 = this.destinationLat * Math.PI / 180;

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    let bearing = Math.round(Math.atan2(y, x) * 180 / Math.PI);

    // Normalizza a 0-359
    bearing = (bearing + 360) % 360;

    return Math.round(bearing);
  }

  private updateBearingMeasurand() {
    if (this.routeSettings.bearing !== undefined) {
      this.appStateSvc.updateMeasurand('brg', {
        value: this.routeSettings.bearing.toString()
      });
    }
  }

  setBearing(degrees: number) {
    this.bearingValue = degrees;
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  // Metodi di utilità per il template
  isBearingMode(): boolean {
    return this.routeSettings.mode === 'bearing';
  }

  isDestinationMode(): boolean {
    return this.routeSettings.mode === 'destination';
  }
}