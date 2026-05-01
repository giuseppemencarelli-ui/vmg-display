import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, shareReplay, startWith } from 'rxjs';
import { SettingsService } from './settings';
import { UserSettings } from '../models/settings.model';
import { LocationService, LocationData } from './location-service';


export type DataKey = 'lat' | 'lng' | 'sog' | 'cog' | 'vmg';


export interface AppState {
  // Dati di navigazione elaborati qui vanno TUTTI i dati visualizzati nell'app, così da avere un unico punto di verità e non dover fare subscribe multipli nei componenti
  navigation:
    Record<DataKey, number | string>;

  // Stato delle connessioni
  status: {
    //isGpsLocked: boolean;
    //isWifiConnected: boolean;
    lastUpdate: Date;
  };
  // Preferenze applicate 
  settings: UserSettings;
}


@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  
// L'unica fonte di verità per tutta l'app
  public readonly state$: Observable<any>;

constructor(
    private locationService: LocationService,
    //private nmea: NmeaService,
    private userSettings: SettingsService
  ) {
    this.state$ = combineLatest([
      this.userSettings.settings$,
      this.locationService.locationData$,
      /*this.nmea.data$*/]).pipe(
        map(([userPrefs, locationData/*, nmeaData,*/]) => {
        // Logica di fusione intelligente
        // ...
        console.log('AppStateService - Nuovo stato calcolato', { userPrefs, locationData/*, nmeaData*/, fontFamily: userPrefs.fontFamily });  

        
        return {
          settings: userPrefs,
          navigation: {
            lat: locationData.lat, 
            lng: locationData.lon, 
            sog: locationData.sog, 
            cog: locationData.cog, 
            vmg: 0, //calcolaVmg(bestSog, bestCog, userPrefs.targetBearing) 
          },
          status: {
            lastUpdate: new Date()
          }
        }
      }),
      // Evita di ricalcolare tutto per ogni nuovo subscriber
      shareReplay(1)
    );
  }
}

