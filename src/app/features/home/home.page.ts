import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AppStateService } from '../../core/services/app-state-service';
import { SettingsService } from '../../core/services/settings';
import { menuOutline } from 'ionicons/icons';
import { LayoutSize, LAYOUT_COLUMNS, Orientation, DEFAULT_SLOTS } from '../../core/models/dashboard.model';
import { MEASURANDS, Measurand } from '../../core/models/measurand.model';
import { MeasurandValues, DEFAULT_MEASURAND_VALUES } from '../../core/models/settings.model';
import { map, Observable, Subject, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FitTextDirective } from '../../directives/fit-text.directive';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    AsyncPipe,
    FitTextDirective,
    CommonModule,IonContent
  ],
})
export class HomePage implements OnInit, OnDestroy {
  private appStateSvc = inject(AppStateService);
  private settingsSvc = inject(SettingsService);
  private router = inject(Router);
  readonly MEASURANDS = MEASURANDS;

  private destroy$ = new Subject<void>();
  private orientationChange$ = new Subject<Orientation>();

  // Variabili per gestire lo swipe
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private readonly SWIPE_THRESHOLD = 50; // pixel minimi per considerarlo uno swipe
  private readonly LAYOUT_ORDER: LayoutSize[] = [1, 2, 4, 6];

  // Mantiene i valori correnti dei measurands (source of truth dallo state)
  currentMeasurandValues: MeasurandValues = DEFAULT_MEASURAND_VALUES;

  state$ = this.appStateSvc.state$;

  gridColumns$ = merge(
    this.state$,
    this.orientationChange$
  ).pipe(
    map(() => {
      const layout = this.getCurrentLayout();
      const orientation = this.getCurrentOrientation();
      return LAYOUT_COLUMNS[orientation][layout] || 2;
    })
  );

  visibleSlots$ = this.state$.pipe(
    map(state => state?.settings?.dashboardConfig?.slots || [])
  );

  styleVersion$ = this.state$.pipe(
    map(state => state?.settings?.styleVersion || 'versione4')
  );

  // Observable per i valori dei measurand (source of truth dallo state)
  measurandValues$ = this.state$.pipe(
    map(state => state?.measurands || {})
  );

  ngOnInit(): void {
    // Sottoscrivi ai valori dei measurands dallo state
    this.measurandValues$
      .pipe(takeUntil(this.destroy$))
      .subscribe(values => {
        this.currentMeasurandValues = values;
      });

    // Ascolta cambiamenti di orientamento
    const mediaQuery = window.matchMedia('(orientation: landscape)');
    
    // Gestisci il cambio di orientamento
    mediaQuery.addEventListener('change', (e) => {
      const orientation: Orientation = e.matches ? 'landscape' : 'portrait';
      console.log('Orientation changed:', orientation);
      this.orientationChange$.next(orientation);
    });

    // Emetti l'orientamento iniziale
    const initialOrientation: Orientation = mediaQuery.matches ? 'landscape' : 'portrait';
    this.orientationChange$.next(initialOrientation);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.orientationChange$.complete();
  }

  private getCurrentLayout(): LayoutSize {
    let layout: LayoutSize = 4; // default
    this.state$.pipe(takeUntil(this.destroy$)).subscribe(state => {
      layout = state?.settings?.dashboardConfig?.layout as LayoutSize;
    });
    return layout;
  }

  private getCurrentOrientation(): Orientation {
    return window.matchMedia('(orientation: landscape)').matches ? 'landscape' : 'portrait';
  }

  /*getContainerPadding(): number {
    return this.getCurrentOrientation() === 'landscape' ? 8 : 12;
  }*/

  getContainerGap(): number {
    return this.getCurrentOrientation() === 'landscape' ? 4 : 8;
  }

  getGridGap(): number {
    return this.getCurrentOrientation() === 'landscape' ? 4 : 8;
  }

  onTouchStart(e: TouchEvent): void {
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
  }

  onTouchEnd(e: TouchEvent): void {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - this.touchStartX;
    const deltaY = touchEndY - this.touchStartY;

    // Ignora se lo swipe è verticale
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }

    // Swipe orizzontale
    if (Math.abs(deltaX) > this.SWIPE_THRESHOLD) {
      if (deltaX > 0) {
        this.cycleLayoutPrevious(); // Swipe right → precedente
      } else {
        this.cycleLayoutNext(); // Swipe left → successivo
      }
    }
  }

  private cycleLayoutNext(): void {
    const currentLayout = this.settingsSvc.currentSettings?.dashboardConfig?.layout as LayoutSize;
    const currentIndex = this.LAYOUT_ORDER.indexOf(currentLayout);
    const nextIndex = (currentIndex + 1) % this.LAYOUT_ORDER.length;
    const nextLayout = this.LAYOUT_ORDER[nextIndex];
    this.updateLayout(nextLayout);
  }

  private cycleLayoutPrevious(): void {
    const currentLayout = this.settingsSvc.currentSettings?.dashboardConfig?.layout as LayoutSize;
    const currentIndex = this.LAYOUT_ORDER.indexOf(currentLayout);
    const prevIndex = (currentIndex - 1 + this.LAYOUT_ORDER.length) % this.LAYOUT_ORDER.length;
    const prevLayout = this.LAYOUT_ORDER[prevIndex];
    this.updateLayout(prevLayout);
  }

  private updateLayout(newLayout: LayoutSize): void {
    const currentSettings = this.settingsSvc.currentSettings;
    if (currentSettings) {
      const updatedSettings = {
        ...currentSettings,
        dashboardConfig: {
          layout: newLayout,
          slots: DEFAULT_SLOTS[newLayout], // Usa gli slot corretti per il nuovo layout
        },
      };
      this.settingsSvc.update(updatedSettings);
      console.log('Layout changed to:', newLayout, 'with slots:', DEFAULT_SLOTS[newLayout]);
    }
  }

  getMeasurandData(measurandId: string): Measurand | undefined {
    return MEASURANDS[measurandId as keyof typeof MEASURANDS];
  }

  getMeasurandValue(measurandId: string): string {
    // Legge il valore dal state (source of truth)
    // Se il measurandId non esiste nel currentMeasurandValues, ritorna "-"
    const value = this.currentMeasurandValues[measurandId as keyof MeasurandValues];
    return value || '—';
  }

  isPositionType(measurandId: string): boolean {
    const data = this.getMeasurandData(measurandId);
    return data?.dataType === 'position';
  }

  getPositionLines(measurandId: string): string[] {
    const value = this.getMeasurandValue(measurandId);
    return value.split(' $ ');
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  goToOperativa() {
    this.router.navigate(['/operativa']);
  }
}
