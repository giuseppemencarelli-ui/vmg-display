import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


export interface LocationData {
  lat: number;      //latitudine
  lon: number;      //longitudine
  sog: number;      //speed over ground
  cog: number;      //course over ground  
  accuracy: number; // precisione in metri
}




@Injectable({
  providedIn: 'root',
})
export class LocationService {
  
  private initialData: LocationData = {
    lat: 0.0,
    lon: 0.0,
    sog: 0.0,
    cog: 0.0,
    accuracy: -1
  };
  private locationData = new BehaviorSubject<LocationData>(this.initialData);
  public locationData$ = this.locationData.asObservable();


  // Metodo per recuperare il valore corrente (non Observable)
  getCurrentValue(): LocationData {
    return this.locationData.value;
  }

  startTracking() {
    console.log('Start Tracking - Simulazione Rotta 40°-50°');

    // Valori di partenza
    let currentLat = 45.0;
    let currentLon = 9.0;
    let currentSog = 6.0;   // Partiamo da una velocità media
    let currentCog = 45.0;  // Centro del tuo nuovo range

    const intervalId = setInterval(() => {
      
      // 1. Variazione SOG (4.0 - 10.0 nodi)
      // Cambiamento fluido di max 0.3 nodi al secondo
      currentSog += (Math.random() - 0.5) * 0.6;
      if (currentSog < 4.0) currentSog = 4.0;
      if (currentSog > 10.0) currentSog = 10.0;

      // 2. Variazione COG (40° - 50°)
      // Simuliamo un timoniere che cerca di mantenere la rotta
      currentCog += (Math.random() - 0.5) * 1.2; 
      if (currentCog < 40) currentCog = 40;
      if (currentCog > 50) currentCog = 50;

      // 3. Calcolo spostamento Lat/Lon (per rendere il movimento reale)
      const speedInDegrees = (currentSog / 3600) / 60; 
      currentLat += speedInDegrees * Math.cos(currentCog * Math.PI / 180);
      currentLon += speedInDegrees * Math.sin(currentCog * Math.PI / 180);

      // 4. Invio dati
      this.locationData.next({
        lat: currentLat,
        lon: currentLon,
        sog: currentSog,
        cog: currentCog,
        accuracy: 2.5
      });

      // Log per debug rapido in console
      console.log(`[SIM] SOG: ${currentSog.toFixed(1)} kn | COG: ${currentCog.toFixed(1).padStart(5, '0')}°`);

    }, 1000); 
  }

  stopTracking() {
    console.log('Stop Tracking');
  
  }

}
