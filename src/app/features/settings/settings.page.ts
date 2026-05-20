import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, IonButton, IonList, IonListHeader, IonItem, IonLabel, IonSelect, IonSelectOption, IonToggle, IonIcon, IonChip, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SettingsService } from '../../core/services/settings';
import { LocalizationService } from '@app/core/services/localization-service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  imports: [
    AsyncPipe,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonBackButton, IonButtons, IonButton, IonIcon,
    IonList,IonListHeader, IonItem, IonLabel,
    IonSelect, IonSelectOption, IonToggle, IonChip,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent
  ],
})
export class SettingsPage {
  public localizationSvc = inject(LocalizationService);
  private settingsSvc = inject(SettingsService);
  private router = inject(Router);
  
  dummynotifications = false; // Placeholder per la funzionalità di notifiche
  // Copia locale per il binding con ngModel
  settings = { ...this.settingsSvc.currentSettings };

  constructor() {
    console.log('SettingsPage - fontFamily iniziale:', this.settings.fontFamily);
  }

  ionViewWillEnter() {
    // Ricarica i settings quando la pagina viene visualizzata
    this.settings = { ...this.settingsSvc.currentSettings };
    console.log('SettingsPage - ionViewWillEnter, fontFamily:', this.settings.fontFamily);
  }

  async onSave() {
    try {
      console.log('SettingsPage - onSave, fontFamily:', this.settings.fontFamily);
      await this.settingsSvc.update(this.settings);
    } catch (err) {
      console.error('Errore salvataggio impostazioni', err);
      // opzionale: mostra un ion-toast di errore
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  isLanguageSelected( lang: string): boolean {
    return this.settings.language === lang;
  }

  onLanguageChange(lang: string) {
    this.settings.language = lang === 'it'  ? 'it' : 'en';
    this.onSave();
  } 
  
  isAspettoSelected( aspetto: string): boolean {
    return this.settings.theme === aspetto;
  }

  onAspettoChange(aspetto: string) {
    this.settings.theme = aspetto === 'device' ? 'device' : (aspetto === 'battery' ? 'battery' : 'night');
    this.onSave();
  }   

  isFontSelected( font: string): boolean {
    return this.settings.fontFamily === font;
  }

  onFontChange(font: string) {
    this.settings.fontFamily = font === 'Orbitron' ? 'Orbitron' : 'JetBrains Mono';
    this.onSave();
  }

  isInstrumentStyleSelected( style: string): boolean {
    return this.settings.styleVersion === style;
  }

  onInstrumentStyleChange(style: string) {
    this.settings.styleVersion = style === 'versione3' ? 'versione3' : 'versione4';
    this.onSave();
  }

  isFusocSelected( fusoc: string): boolean {
    return this.settings.timeFormat === fusoc;
  }   
  onFusocChange(fusoc: string) {
    this.settings.timeFormat = fusoc === 'local' ? 'local' : 'utc';
    this.onSave();
  }
  
  isShowSecondsSelected( showSeconds: boolean): boolean {
    return this.settings.showSeconds === showSeconds;
  }   
  onShowSecondsChange(showSeconds: boolean) {
    this.settings.showSeconds = showSeconds;
    this.onSave();
  }

}
