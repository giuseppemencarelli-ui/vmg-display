// models/settings.model.ts
import { DashboardConfig, DEFAULT_DASHBOARD_CONFIG } from './dashboard.model';
import { MeasurandId } from './measurand.model';

export type Theme = 'device' | 'battery' | 'night';
export type Language = 'it' | 'en';
export type FontFamily = 'Orbitron' | 'JetBrains Mono';
export type StyleVersion = 'versione3' | 'versione4';
export type SpeedUnit = 'kn' | 'km/h';
export type DistanceUnit = 'nm' | 'km';
export type DepthUnit = 'm' | 'ft';
export type PositionFormat = 'decimal' | 'ddmm' | 'ddmmss';
export type TimeFormat = 'local' | 'utc';

// ============================================================================
// VALORI DEI MEASURANDS - Source of Truth
// ============================================================================
export interface MeasurandValue {
  value: string;
  message?: string;  // opzionale prefisso con (i) per messaggi informativi, (e) per errore sostituisce icona e valore con messaggio oopure nulla diveta i senza icona
}

export type MeasurandValues = Record<MeasurandId, MeasurandValue>;

export const DEFAULT_MEASURAND_VALUES: MeasurandValues = {
  sog: { value: '—' },
  max: { value: '—' },
  cog: { value: '—' },
  pos: { value: '—' },
  vmg: { value: '—' },
  eff: { value: '—' },
  brg: { value: '—' },
  cdi: { value: '—' },

  wind_speed: { value: '—' },
  wind_angle: { value: '—' },
  depth: { value: '—' },
  destination_dist: { value: '—' },
  destination_eta: { value: '—' },
  hdg: { value: '—' },
  rpm: { value: '—' },
  water_temp: { value: '—' }
};

export interface UserSettings {
  theme: Theme;
  language: Language;
  fontFamily: FontFamily;
  styleVersion: StyleVersion;
  speedUnit: SpeedUnit;
  distanceUnit: DistanceUnit;
  depthUnit: DepthUnit;
  positionFormat: PositionFormat;
  dashboardConfig: DashboardConfig;
  timeFormat: TimeFormat;
  showSeconds: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'device',
  language: 'it',
  fontFamily: 'Orbitron',
  styleVersion: 'versione4',
  speedUnit: 'kn',
  distanceUnit: 'nm',
  depthUnit: 'm',
  timeFormat: 'local',
  showSeconds: false,
  positionFormat: 'ddmm',
  dashboardConfig: DEFAULT_DASHBOARD_CONFIG,
};