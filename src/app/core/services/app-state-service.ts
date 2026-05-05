import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, shareReplay } from 'rxjs';
import { SettingsService } from './settings';
import { UserSettings } from '../models/settings.model';
import { MeasurandValues, DEFAULT_MEASURAND_VALUES } from '../models/settings.model';
import { Status, DEFAULT_STATUS } from '../models/status.model';
import { LocationService, LocationData } from './location-service';


export interface AppState {
  // MEASURANDS - Source of Truth per tutti i dati visualizzati
  // Ogni MeasurandId ha un valore string (o "-" come default)
  measurands: MeasurandValues;

  // STATUS - Stato dell'app e dei servizi
  status: Status;

  // Preferenze applicate 
  settings: UserSettings;
}


@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  
  // L'unica fonte di verità per tutta l'app
  public readonly state$: Observable<AppState>;

  constructor(
    private locationService: LocationService,
    //private nmeaService: NmeaService, // TODO: Aggiungere il servizio NMEA in futuro
    private userSettings: SettingsService
  ) {
    this.state$ = combineLatest([
      this.userSettings.settings$,
      this.locationService.locationData$,
      // TODO: Aggiungere qui il combineLatest con nmeaService.data$ in futuro
      // this.nmeaService.data$
    ]).pipe(
      map(([userPrefs, locationData/*, nmeaData*/]) => {
        // Mappiamo i dati dalle fonti ai measurands con default "-"
        const measurands = this.mergeMeasurandData(locationData/*, nmeaData*/);
        
        // Aggiorniamo lo status dei servizi
        const status = this.updateStatus(locationData/*, nmeaData*/);

        console.log('AppStateService - Nuovo stato calcolato', { 
          measurands,
          status: { gps: status.gps, nmea: status.nmea },
          settings: { theme: userPrefs.theme, fontFamily: userPrefs.fontFamily, styleVersion: userPrefs.styleVersion }
        });

        return {
          measurands,
          status,
          settings: userPrefs
        } as AppState;
      }),
      // Evita di ricalcolare tutto per ogni nuovo subscriber
      shareReplay(1)
    );
  }

  /**
   * Mappa i dati da LocationService, NmeaService e altre fonti ai measurands
   * In futuro, è facile aggiungere nuove fonti (ad es. nmeaData)
   */
  private mergeMeasurandData(
    locationData: LocationData,
    // nmeaData?: NmeaData // TODO: Aggiungere il parametro NMEA in futuro
  ): MeasurandValues {
    // Inizio con i default
    const measurands: MeasurandValues = { ...DEFAULT_MEASURAND_VALUES };

    // Mappiamo i dati dal LocationService
    if (locationData) {
      measurands.pos.value = `${locationData.lat.toFixed(4)} $ ${locationData.lon.toFixed(4)}`;
      measurands.sog.value = locationData.sog.toFixed(1);
      measurands.cog.value = locationData.cog.toFixed(0);
      measurands.vmg.value = '—'; // VMG non calcolato direttamente da LocationService, rimane default per ora
      measurands.vmg.message = '(i)Impostare una rotta';
      console.log('AppStateService - Measurands aggiornati da LocationService:');
    }

    // TODO: In futuro, aggiungere qui la logica per mappare i dati da NmeaService
    // if (nmeaData) {
    //   measurands.wind_speed = nmeaData.windSpeed?.toFixed(1) || '—';
    //   measurands.wind_angle = nmeaData.windAngle?.toFixed(0) || '—';
    //   measurands.depth = nmeaData.depth?.toFixed(1) || '—';
    //   measurands.hdg = nmeaData.heading?.toFixed(0) || '—';
    //   measurands.rpm = nmeaData.rpm?.toFixed(0) || '—';
    //   measurands.water_temp = nmeaData.waterTemp?.toFixed(1) || '—';
    //   // ... altri campi NMEA
    // }

    return measurands;
  }

  /**
   * Aggiorna lo status dei servizi disponibili
   * GPS: sempre abilitato, hasFix dipende da accuracy (< 100m = valid fix)
   * NMEA: attualmente non collegato (placeholder per futuro servizio)
   * Wearables: attualmente non abilitato (placeholder per futuro servizio)
   */
  private updateStatus(
    locationData: LocationData,
    // nmeaData?: NmeaData // TODO: Aggiungere il parametro NMEA in futuro
  ): Status {
    const status = { ...DEFAULT_STATUS };

    // Aggiorna GPS Status
    if (locationData) {
      status.gps.enabled = true;
      status.gps.accuracy = locationData.accuracy || 0;
      status.gps.hasFix = (locationData.accuracy || 1000) < 100; // Fix valido se accuracy < 100m

    }

    // TODO: In futuro, aggiungere qui la logica per NMEA
    // if (nmeaData) {
    //   status.nmea.enabled = true;
    //   status.nmea.isConnected = nmeaData.isConnected;
    // }

    // TODO: In futuro, aggiungere qui la logica per Wearables
    // if (wearableData) {
    //   status.wearables.enabled = true;
    //   status.wearables.isConnected = wearableData.isConnected;
    // }
    
    return status;
  }
}

