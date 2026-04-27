import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';

import { UserSettings, DEFAULT_SETTINGS } from '../models/settings.model';
//const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

@Injectable({
  providedIn: 'root',
})
export class SettingsService {


  // Inizializziamo il BehaviorSubject con i default
  private settings = new BehaviorSubject<UserSettings>(DEFAULT_SETTINGS);
  public settings$ = this.settings.asObservable();


constructor() {}

  /**
   * Metodo chiamato dall'APP_INITIALIZER
   */
  async load(): Promise<void> {
    try {
      //await delay(3000);
      const { value } = await Preferences.get({ key: 'my_app_prefs' });
      if (value) {
        const parsed = JSON.parse(value);
        this.settings.next({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } finally {
    }
  }

  /**
   * Getter sincrono per accedere ai valori al volo nel codice TS
   */
  get currentSettings(): UserSettings {
    return this.settings.value;
  }

  /**
   * Aggiornamento parziale e salvataggio
   */
  async update(patch: Partial<UserSettings>): Promise<void> {
    const updated = { ...this.settings.value, ...patch };

    console.log('SettingsService - Nuovo stato calcolato', { updated });  

    this.settings.next(updated);
    await Preferences.set({
      key: 'my_app_prefs',
      value: JSON.stringify(updated)
    });

  }
}
