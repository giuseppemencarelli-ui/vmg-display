import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, shareReplay, BehaviorSubject } from 'rxjs';
import { SettingsService } from './settings';
import { UserSettings } from '../models/settings.model';
import { MeasurandValues, DEFAULT_MEASURAND_VALUES } from '../models/settings.model';
import { Status, DEFAULT_STATUS } from '../models/status.model';
import { LocationService, LocationData } from './location-service';
import { calculateVmg, calculateDestinationEta, calculateCdi, haversineDistanceNm } from '../utils/navigation-calculations';


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

  // Subject per aggiornamenti manuali dei measurands
  private manualMeasurands$ = new BehaviorSubject<Partial<MeasurandValues>>({});

  constructor(
    private locationService: LocationService,
    //private nmeaService: NmeaService, // TODO: Aggiungere il servizio NMEA in futuro
    private userSettings: SettingsService
  ) {
    this.state$ = combineLatest([
      this.userSettings.settings$,
      this.locationService.locationData$,
      this.manualMeasurands$
      // TODO: Aggiungere qui il combineLatest con nmeaService.data$ in futuro
      // this.nmeaService.data$
    ]).pipe(
      map(([userPrefs, locationData, manualMeasurands/*, nmeaData*/]) => {
        // Mappiamo i dati dalle fonti ai measurands con default "-"
        const measurands = this.mergeMeasurandData(userPrefs,locationData, manualMeasurands/*, nmeaData*/);
        
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
    userPrefs: UserSettings,
    locationData: LocationData,
    manualMeasurands: Partial<MeasurandValues>,
    // nmeaData?: NmeaData // TODO: Aggiungere il parametro NMEA in futuro
  ): MeasurandValues {
    // Inizio con i default
    const measurands: MeasurandValues = { ...DEFAULT_MEASURAND_VALUES };

    if (userPrefs) {
      if(userPrefs.routeSettings.bearing !== undefined) {
        measurands.brg.value = userPrefs.routeSettings.bearing.toFixed(0);
      }
    }

    if (locationData) {
      measurands.pos.value = `${locationData.lat.toFixed(4)} $ ${locationData.lon.toFixed(4)}`;
      measurands.sog.value = locationData.sog.toFixed(1);
      measurands.cog.value = locationData.cog.toFixed(0);

      const routeBearing = userPrefs?.routeSettings?.bearing;
      const vmgValue = typeof routeBearing === 'number'
        ? calculateVmg(locationData.sog, locationData.cog, routeBearing)
        : null;

      if (vmgValue !== null) {
        measurands.vmg.value = vmgValue.toFixed(1);
        measurands.vmg.message = '';
      } else {
        measurands.vmg.value = '—';
        measurands.vmg.message = '(i)Impostare una rotta';
      }

      const destination = userPrefs?.routeSettings?.destination;
      if (destination && typeof destination.latitude === 'number' && typeof destination.longitude === 'number') {
        const distanceNm = haversineDistanceNm(
          locationData.lat,
          locationData.lon,
          destination.latitude,
          destination.longitude
        );

        if (distanceNm !== null) {
          measurands.destination_dist.value = distanceNm.toFixed(1);
          const eta = calculateDestinationEta(distanceNm, locationData.sog);
          measurands.destination_eta.value = eta || '—';
          measurands.destination_eta.message = eta ? '' : '(i)Impostare la velocità';
        }
      }
      if (typeof routeBearing === 'number') {
        const cdiValue = calculateCdi(locationData.cog, routeBearing);
        if (cdiValue !== null) {
          measurands.cdi.value = cdiValue.toFixed(0);
          measurands.cdi.message = '';
          measurands.cdi_value.value = cdiValue.toFixed(0);
        }
      }
      console.log('AppStateService - Measurands aggiornati da LocationService:');
    }

    // Applichiamo gli aggiornamenti manuali
    Object.keys(manualMeasurands).forEach(key => {
      const measurandId = key as keyof MeasurandValues;
      const manualValue = manualMeasurands[measurandId];
      if (manualValue) {
        measurands[measurandId] = { ...measurands[measurandId], ...manualValue };
      }
    });

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

  /**
   * Aggiorna manualmente un measurand
   */
  updateMeasurand(measurandId: keyof MeasurandValues, value: Partial<MeasurandValues[keyof MeasurandValues]>) {
    const currentManual = this.manualMeasurands$.value;
    this.manualMeasurands$.next({
      ...currentManual,
      [measurandId]: { ...currentManual[measurandId], ...value }
    });
  }

  /**
   * Ottiene lo stato corrente (snapshot)
   */
  getCurrentState(): AppState | null {
    let currentState: AppState | null = null;
    this.state$.subscribe(state => currentState = state).unsubscribe();
    return currentState;
  }
}

