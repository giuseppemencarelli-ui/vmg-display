import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


export interface LocationData {
  lat: number;      //latitudine
  lon: number;      //longitudine
  sog: number;      //speed over ground
  cog: number;      //course over ground  
}




@Injectable({
  providedIn: 'root',
})
export class LocationService {
  
  private initialData: LocationData = {
    lat: 0.0,
    lon: 0.0,
    sog: 0.0,
    cog: 0.0
  };
  private locationData = new BehaviorSubject<LocationData>(this.initialData);
  public locationData$ = this.locationData.asObservable();


  // Metodo per recuperare il valore corrente (non Observable)
  getCurrentValue(): LocationData {
    return this.locationData.value;
  }

  startTracking() {
    console.log('Start Tracking');
    // Simulazione di aggiornamento dati
    setTimeout(() => {
      this.locationData.next({
        lat: 45.0,
        lon: 9.0,
        sog: 5.5,
        cog: 180.0
      });
    }, 5000);
  }

  stopTracking() {
    console.log('Stop Tracking');
  
  }

}
